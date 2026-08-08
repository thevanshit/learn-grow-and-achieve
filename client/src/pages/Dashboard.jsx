import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api.js';
import { ProgressRing, StatCard, ProgressBar, Empty, CountUp, toast } from '../components/ui.jsx';
import { IconFire, IconBook, IconFlag, IconCalendar, IconCheck, IconPages, IconTrendUp, IconTrendDown } from '../components/Icons.jsx';

const todayStr = () => new Date().toISOString().slice(0, 10);

export default function Dashboard({ onCelebrate }) {
  const [stats, setStats] = useState(null);
  const [batches, setBatches] = useState([]);
  const [weeks, setWeeks] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [slider, setSlider] = useState(null);

  const load = () => {
    setLoading(true);
    Promise.all([api.stats(), api.batches(), api.weeks(), api.tasks(todayStr()), api.plan()])
      .then(([s, b, w, t, p]) => { setStats(s); setBatches(b); setWeeks(w); setTasks(t); setPlan(p); })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  if (loading) return <div className="splash"><div className="spinner" /></div>;

  const user = JSON.parse(localStorage.getItem('lga_user') || '{}');
  const firstName = (user.name || 'there').split(' ')[0];
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  const dayOfPlan = Math.min(Math.max(Math.floor((new Date() - new Date('2026-08-08')) / 86400000) + 1, 1), 177);

  const overall = stats.weeksTotal ? Math.round((stats.weeksDone / stats.weeksTotal) * 100) : 0;
  const booksPct = stats.booksTotal ? Math.round((stats.booksDone / stats.booksTotal) * 100) : 0;
  const milestonePct = stats.milestonesTotal ? Math.round((stats.milestonesDone / stats.milestonesTotal) * 100) : 0;

  const currentWeek = weeks.find(w => w.week === stats.currentWeek);
  const todayTasks = tasks.filter(t => !t.completed);
  const doneToday = tasks.filter(t => t.completed).length;

  const toggleWeek = async (week) => {
    const next = !week.completed;
    await api.toggleWeek(week.id, next);
    if (next) { onCelebrate(); toast(`Week ${week.week} complete — on track.`); }
    load();
  };

  const saveProgress = async () => {
    if (!plan?.currentBook || slider === null) return;
    await api.updateBook(plan.currentBook.id, { status: 'reading', progress: slider });
    toast(`Progress saved — ${slider}% of "${plan.currentBook.title}"`);
    setSlider(null);
    load();
  };

  const currentBookProgress = plan?.currentBookProgress ?? 0;

  return (
    <div>
      <div className="page-header">
        <h1>Good {greeting()}, {firstName}</h1>
        <p>{today} · Week {stats.currentWeek} of 40 · Day {dayOfPlan} of 177 · {stats.streak > 0 ? `${stats.streak}-day streak` : 'Start your streak today'}</p>
      </div>

      {/* Top stats */}
      <div className="grid grid-4 mb-24">
        <div className="anim-in-1"><StatCard icon={<IconFire />} iconBg="#f97316" value={<CountUp value={stats.streak} />} label="Day streak" sub="Keep it alive daily" /></div>
        <div className="anim-in-2"><StatCard icon={<IconBook />} value={<><CountUp value={stats.booksDone} />/{stats.booksTotal}</>} label="Books done" sub={`${stats.booksReading} currently reading`} /></div>
        <div className="anim-in-3"><StatCard icon={<IconPages />} iconBg="#8b5cf6" value={plan ? <><CountUp value={plan.pagesRead} />/{plan.totalPages.toLocaleString()}</> : '—'} label="Pages read" sub={plan ? `${plan.pagesPerDay} pages/day needed` : ''} /></div>
        <div className="anim-in-4"><StatCard icon={<IconFlag />} value={<><CountUp value={stats.milestonesDone} />/{stats.milestonesTotal}</>} label="Milestones" sub="Portfolio proof" /></div>
      </div>

      <div className="grid grid-2">
        {/* Today's reading */}
        <div className="card anim-in-2">
          <div className="card-title"><IconBook /> Today's Reading</div>
          {plan && plan.today ? (
            <div className="mb-16">
              <div className="badge reading mb-8">Book #{plan.today.book.id} · {plan.today.book.title}</div>
              <p className="muted" style={{ fontSize: 13 }}>
                <strong>Read pages {plan.today.fromPage}–{plan.today.toPage}</strong> ({plan.today.pagesToday} pages)
                {plan.today.book.author ? ` · ${plan.today.book.author}` : ''}
              </p>
              <div className="flex-between mt-8 mb-8">
                <span className="muted" style={{ fontSize: 12 }}>Book progress</span>
                <span className="muted" style={{ fontSize: 12 }}>{plan.today.bookProgress}%</span>
              </div>
              <ProgressBar value={plan.today.bookProgress} className="success" />
              <div className="flex-between mt-12">
                <span className={`badge ${plan.onTrack ? 'low' : 'high'}`}>
                  {plan.onTrack ? <><IconTrendUp size={13} /> On track</> : <><IconTrendDown size={13} /> Behind pace</>}
                </span>
                <span className="muted" style={{ fontSize: 12 }}>{plan.daysRemaining} days to Feb 1, 2027</span>
              </div>

              {/* Quick progress logging */}
              {plan.currentBook && (
                <div className="mt-16" style={{ borderTop: '1px solid var(--border)', paddingTop: 14 }}>
                  <div className="flex-between mb-8">
                    <span style={{ fontSize: 13, fontWeight: 600 }}>Update your progress</span>
                    <span className="muted" style={{ fontSize: 12 }}>{slider ?? currentBookProgress}%</span>
                  </div>
                  <input
                    type="range" min={0} max={100} step={5}
                    value={slider ?? currentBookProgress}
                    onChange={e => setSlider(Number(e.target.value))}
                    style={{ width: '100%', accentColor: 'var(--primary)' }}
                  />
                  <div className="flex mt-8" style={{ justifyContent: 'flex-end' }}>
                    <button className="btn btn-primary btn-sm" onClick={saveProgress} disabled={slider === null}>
                      <IconCheck size={14} /> Save progress
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Empty text={plan && plan.booksDone === plan.booksTotal ? 'All books finished — incredible!' : 'No reading assignment yet.'} />
          )}

          <div className="card-title mt-16" style={{ marginBottom: 8 }}>Today's Focus</div>
          {currentWeek ? (
            <div className="mb-16">
              <div className="badge reading mb-8">Week {currentWeek.week} · {currentWeek.title}</div>
              <p className="muted" style={{ fontSize: 13 }}><strong>Read:</strong> {currentWeek.read}</p>
              <p className="muted mt-8" style={{ fontSize: 13 }}><strong>Do:</strong> {currentWeek.do}</p>
              <button
                className={`btn ${currentWeek.completed ? 'btn-secondary' : 'btn-primary'} mt-16`}
                onClick={() => toggleWeek(currentWeek)}
              >
                {currentWeek.completed ? <><IconCheck size={15} /> Week completed</> : 'Mark week complete'}
              </button>
            </div>
          ) : <Empty text="You finished the 40-week plan!" />}

          <div className="card-title mt-16" style={{ marginBottom: 8 }}>Today's Tasks</div>
          {todayTasks.length === 0 && doneToday === 0 ? (
            <Empty text="Nothing on the list today. Add a task in Tasks." />
          ) : (
            <>
              {todayTasks.slice(0, 4).map(t => (
                <div key={t.id} className="task-item">
                  <button className="checkbox" onClick={() => api.updateTask(t.id, { completed: 1 }).then(load)} />
                  <div className="task-body">
                    <div className="task-title">{t.title}</div>
                    <div className="task-meta"><span className={`badge ${t.priority}`}>{t.priority}</span></div>
                  </div>
                </div>
              ))}
              {doneToday > 0 && <p className="muted mt-8" style={{ fontSize: 13 }}><IconCheck size={13} /> {doneToday} done today</p>}
            </>
          )}
        </div>

        {/* Progress + countdown */}
        <div className="anim-in-3">
          <div className="card mb-16">
            <div className="card-title">Overall Progress</div>
            <div className="flex" style={{ gap: 24 }}>
              <ProgressRing value={overall} label="overall" />
              <div style={{ flex: 1 }}>
                <div className="mb-12">
                  <div className="flex-between mb-8"><span className="muted" style={{ fontSize: 13 }}>Weeks</span><strong>{stats.weeksDone}/{stats.weeksTotal}</strong></div>
                  <ProgressBar value={overall} />
                </div>
                <div className="mb-12">
                  <div className="flex-between mb-8"><span className="muted" style={{ fontSize: 13 }}>Books</span><strong>{stats.booksDone}/{stats.booksTotal}</strong></div>
                  <ProgressBar value={booksPct} className="success" />
                </div>
                <div>
                  <div className="flex-between mb-8"><span className="muted" style={{ fontSize: 13 }}>Milestones</span><strong>{stats.milestonesDone}/{stats.milestonesTotal}</strong></div>
                  <ProgressBar value={milestonePct} />
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-title"><IconCalendar /> GSoC 2027 Countdown</div>
            {stats.gsoc.map(g => (
              <div key={g.key} className="flex-between mb-8" style={{ padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{g.label}</div>
                  <div className="muted" style={{ fontSize: 12 }}>{new Date(g.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                </div>
                <span className={`badge ${g.daysLeft <= 30 ? 'high' : g.daysLeft <= 90 ? 'medium' : 'low'}`}>
                  {g.daysLeft === 0 ? 'Today!' : `${g.daysLeft} days`}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Batch progress strip */}
      <div className="card mt-16 anim-in-4">
        <div className="card-title flex-between">
          <span>Batch Progress</span>
          <Link to="/planner" className="btn btn-secondary btn-sm">Open planner</Link>
        </div>
        <div className="grid grid-2">
          {batches.map(b => (
            <div key={b.id} className="flex" style={{ gap: 12 }}>
              <div className="batch-dot" style={{ background: b.color }} />
              <div style={{ flex: 1 }}>
                <div className="flex-between mb-8">
                  <span style={{ fontWeight: 600, fontSize: 13 }}>B{b.id} · {b.title}</span>
                  <span className="muted" style={{ fontSize: 12 }}>{b.weeksDone}/{b.weeksTotal} wk</span>
                </div>
                <ProgressBar value={b.progress} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 18) return 'afternoon';
  return 'evening';
}