import { useState, useEffect } from 'react';
import api from '../api.js';
import { PageHeader, ProgressBar, Empty, toast } from '../components/ui.jsx';
import { IconCheck, IconChevron, IconSparkles } from '../components/Icons.jsx';

export default function Planner({ onCelebrate }) {
  const [batches, setBatches] = useState([]);
  const [weeks, setWeeks] = useState([]);
  const [open, setOpen] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.batches(), api.weeks()])
      .then(([b, w]) => {
        setBatches(b);
        setWeeks(w);
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

  return (
    <div>
      <PageHeader
        title="Planner"
        subtitle="11 batches · 40 weeks · from first commit to GSoC proposal. One week at a time."
      />

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