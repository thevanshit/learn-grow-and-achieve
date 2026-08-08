import { useState, useEffect } from 'react';
import api from '../api.js';
import { PageHeader, ProgressBar, ProgressRing, StatCard, CountUp, Empty, toast } from '../components/ui.jsx';
import { IconCheck, IconChevron, IconSparkles, IconBook, IconCalendar, IconFlag, IconTarget } from '../components/Icons.jsx';

export default function Planner({ onCelebrate }) {
  const [batches, setBatches] = useState([]);
  const [weeks, setWeeks] = useState([]);
  const [stats, setStats] = useState(null);
  const [open, setOpen] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.batches(), api.weeks(), api.stats()])
      .then(([b, w, s]) => {
        setBatches(b);
        setWeeks(w);
        setStats(s);
        // auto-open the first incomplete batch
        const firstIncomplete = b.find(x => x.progress < 100);
        setOpen({ [firstIncomplete?.id || 1]: true });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="splash"><div className="spinner" /></div>;

  const toggleWeek = async (week) => {
    const next = !week.completed;
    await api.toggleWeek(week.id, next);
    if (next) { onCelebrate(); toast(`Week ${week.week} complete — on track.`); }
    setWeeks(ws => ws.map(w => w.id === week.id ? { ...w, completed: next ? 1 : 0 } : w));
    setBatches(bs => bs.map(b => {
      if (b.id !== week.batch_id) return b;
      const delta = next ? 1 : -1;
      const weeksDone = Math.max(0, b.weeksDone + delta);
      return { ...b, weeksDone, progress: b.weeksTotal ? Math.round((weeksDone / b.weeksTotal) * 100) : 0 };
    }));
  };

  const weeksDone = batches.reduce((s, b) => s + b.weeksDone, 0);
  const weeksTotal = batches.reduce((s, b) => s + b.weeksTotal, 0);
  const booksDone = batches.reduce((s, b) => s + b.booksDone, 0);
  const booksTotal = batches.reduce((s, b) => s + b.booksTotal, 0);
  const overallPct = weeksTotal ? Math.round((weeksDone / weeksTotal) * 100) : 0;
  const currentWeek = stats?.currentWeek ?? 1;

  return (
    <div>
      <PageHeader
        title="Planner"
        subtitle="11 batches · 40 weeks · from first commit to GSoC proposal. One week at a time."
      />

      {/* Top stats */}
      <div className="grid grid-4 mb-24">
        <div className="anim-in-1"><StatCard icon={<IconCalendar />} iconBg="#6366f1" value={<><CountUp value={weeksDone} />/{weeksTotal}</>} label="Weeks done" sub={`Week ${currentWeek} of 40 now`} /></div>
        <div className="anim-in-2"><StatCard icon={<IconBook />} iconBg="#10b981" value={<><CountUp value={booksDone} />/{booksTotal}</>} label="Books done" sub="Across all batches" /></div>
        <div className="anim-in-3"><StatCard icon={<IconFlag />} iconBg="#f59e0b" value={<><CountUp value={stats?.milestonesDone ?? 0} />/{stats?.milestonesTotal ?? 0}</>} label="Milestones" sub="Portfolio proof" /></div>
        <div className="anim-in-4"><StatCard icon={<IconSparkles />} iconBg="#8b5cf6" value={<CountUp value={overallPct} suffix="%" />} label="Plan complete" sub={`${weeksTotal - weeksDone} weeks to go`} /></div>
      </div>

      {/* Overall ring + batches */}
      <div className="grid grid-2 mb-16">
        <div className="card anim-in-2">
          <div className="card-title"><IconTarget /> Plan progress</div>
          <div className="flex" style={{ gap: 24 }}>
            <ProgressRing value={overallPct} label="of plan" />
            <div style={{ flex: 1 }}>
              <div className="mb-12">
                <div className="flex-between mb-8"><span className="muted" style={{ fontSize: 13 }}>Weeks</span><strong>{weeksDone}/{weeksTotal}</strong></div>
                <ProgressBar value={overallPct} />
              </div>
              <div className="mb-12">
                <div className="flex-between mb-8"><span className="muted" style={{ fontSize: 13 }}>Books</span><strong>{booksDone}/{booksTotal}</strong></div>
                <ProgressBar value={booksTotal ? Math.round((booksDone / booksTotal) * 100) : 0} className="success" />
              </div>
              <div>
                <div className="flex-between mb-8"><span className="muted" style={{ fontSize: 13 }}>Milestones</span><strong>{stats?.milestonesDone ?? 0}/{stats?.milestonesTotal ?? 0}</strong></div>
                <ProgressBar value={stats?.milestonesTotal ? Math.round(((stats.milestonesDone || 0) / stats.milestonesTotal) * 100) : 0} />
              </div>
            </div>
          </div>
        </div>

        <div className="card anim-in-3">
          <div className="card-title"><IconCalendar /> Where you are</div>
          <p className="muted" style={{ fontSize: 14, lineHeight: 1.7 }}>
            You're in <strong>week {currentWeek}</strong> of 40. The org list drops <strong>Feb 8, 2027</strong> — that's your first big checkpoint.
            Keep the weekly read/do rhythm and the daily page target; the plan does the rest.
          </p>
          <div className="flex mt-16" style={{ flexWrap: 'wrap' }}>
            <span className="badge reading">Week {currentWeek} active</span>
            <span className="badge low">{weeksTotal - weeksDone} weeks remaining</span>
            <span className="badge done">{overallPct}% complete</span>
          </div>
        </div>
      </div>

      {batches.map((b, bi) => {
        const batchWeeks = weeks.filter(w => w.batch_id === b.id);
        const isOpen = !!open[b.id];
        return (
          <div key={b.id} className={`card anim-in-${Math.min(bi + 1, 6)}`}>
            <button
              className="batch-head-btn"
              onClick={() => setOpen(o => ({ ...o, [b.id]: !o[b.id] }))}
            >
              <div className="flex" style={{ gap: 12, minWidth: 0 }}>
                <div className="batch-dot" style={{ background: b.color }} />
                <div style={{ minWidth: 0 }}>
                  <div className="batch-title">Batch {b.id} — {b.title}</div>
                  <div className="batch-meta">{b.focus} · {b.calendar} · Weeks {b.weeks}</div>
                </div>
              </div>
              <div className="flex" style={{ gap: 14, flexShrink: 0 }}>
                <div style={{ width: 130 }}>
                  <ProgressBar value={b.progress} striped={b.progress === 100} />
                  <div className="muted" style={{ fontSize: 11, marginTop: 4 }}>{b.weeksDone}/{b.weeksTotal} weeks · {b.booksDone}/{b.booksTotal} books</div>
                </div>
                <span className={`chevron${isOpen ? ' open' : ''}`}><IconChevron size={16} /></span>
              </div>
            </button>

            {isOpen && (
              <div className="mt-16 anim-pop">
                {batchWeeks.map(w => (
                  <div key={w.id} className={`task-item${w.completed ? ' done' : ''}`}>
                    <button
                      className={`checkbox${w.completed ? ' checked' : ''}`}
                      onClick={() => toggleWeek(w)}
                      aria-label={`Toggle week ${w.week}`}
                    >
                      {w.completed && <IconCheck size={13} />}
                    </button>
                    <div className="task-body">
                      <div className="task-title">Week {w.week} · {w.title}</div>
                      <div className="task-meta"><strong>Read:</strong> {w.read}</div>
                      <div className="task-meta"><strong>Do:</strong> {w.do}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}

      {batches.length === 0 && <Empty text="No batches loaded." />}
    </div>
  );
}