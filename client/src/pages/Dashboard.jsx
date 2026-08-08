import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import api from '../api.js';
import { ProgressRing, StatCard, ProgressBar, Empty, CountUp, toast } from '../components/ui.jsx';
import { IconFire, IconBook, IconFlag, IconCalendar, IconCheck, IconPages, IconTrendUp, IconTrendDown, IconZap, IconQuote, IconArrowRight } from '../components/Icons.jsx';

const todayStr = () => new Date().toISOString().slice(0, 10);

const QUOTES = [
  'The best time to start was yesterday. The second best time is right now.',
  'Small pages add up to big proposals. Keep turning them.',
  'Consistency beats intensity. Show up today.',
  'Every expert was once a beginner who didn\'t quit.',
  'Your future self is reading this plan. Don\'t let them down.',
  'One page at a time. One commit at a time. One milestone at a time.',
  'The org list doesn\'t care about your excuses. It cares about your work.',
  'Discipline is choosing what you want most over what you want now.',
  'You don\'t need motivation. You need momentum.',
  'Six months from now, you\'ll wish you started today.',
];

export default function Dashboard({ onCelebrate }) {
  const [stats, setStats] = useState(null);
  const [batches, setBatches] = useState([]);
  const [weeks, setWeeks] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [daily, setDaily] = useState([]);
  const [plan, setPlan] = useState(null);
  const [now, setNow] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [slider, setSlider] = useState(null);
  const sliderRef = useRef(null);

  const load = () => {
    setLoading(true);
    Promise.all([api.stats(), api.batches(), api.weeks(), api.tasks(todayStr()), api.daily(), api.plan()])
      .then(([s, b, w, t, d, p]) => { setStats(s); setBatches(b); setWeeks(w); setTasks(t); setDaily(d); setPlan(p); })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(load, []);
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  if (loading) return <div className="splash"><div className="spinner" /></div>;

  const user = JSON.parse(localStorage.getItem('lga_user') || '{}');
  const firstName = (user.name || 'there').split(' ')[0];
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  const dayOfPlan = Math.min(Math.max(Math.floor((new Date() - new Date('2026-08-08')) / 86400000) + 1, 1), 177);
  const quote = QUOTES[Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 86400000) % QUOTES.length];

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

  // ---- Live countdown to next GSoC milestone ----
  const nextMilestone = stats.gsoc.find(g => g.daysLeft > 0) || stats.gsoc[stats.gsoc.length - 1];
  const nextDate = new Date(nextMilestone.date);
  const msLeft = Math.max(0, nextDate - now);
  const cd = {
    days: Math.floor(msLeft / 86400000),
    hours: Math.floor((msLeft % 86400000) / 3600000),
    mins: Math.floor((msLeft % 3600000) / 60000),
    secs: Math.floor((msLeft % 60000) / 1000),
  };

  // ---- 7-day reading activity ----
  const weekDays = [...Array(7)].map((_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i));
    const key = d.toISOString().slice(0, 10);
    const log = daily.find(x => x.date === key);
    return { key, label: d.toLocaleDateString('en-US', { weekday: 'narrow' }), pages: log?.pages_read || 0, tasks: log?.tasks_completed || 0 };
  });
  const maxPages = Math.max(...weekDays.map(d => d.pages), 1);
  const weekPages = weekDays.reduce((s, d) => s + d.pages, 0);

  // ---- Pace ----
  const paceDiff = plan?.paceDiff ?? 0;
  const projected = plan?.projectedFinishDate;

  return (
    <div>
      <div className="page-header">
        <h1>Good {greeting()}, {firstName}</h1>
        <p>{today} · Week {stats.currentWeek} of 40 · Day {dayOfPlan} of 177 · {stats.streak > 0 ? `${stats.streak}-day streak` : 'Start your streak today'}</p>
      </div>

      {/* Quote */}
      <div className="card mb-16 anim-in-1" style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 12, borderLeft: '3px solid var(--warning)' }}>
        <IconQuote size={18} style={{ color: 'var(--warning)', flexShrink: 0 }} />
        <p className="muted" style={{ fontSize: 13.5, fontStyle: 'italic' }}>{quote}</p>
      </div>

      {/* Top stats */}
      <div className="grid grid-4 mb-24">
        <div className="anim-in-1"><StatCard icon={<IconFire />} iconBg="#f97316" value={<CountUp value={stats.streak} />} label="Day streak" sub="Reading + tasks count" /></div>
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
                <div ref={sliderRef} className="mt-16" style={{ borderTop: '1px solid var(--border)', paddingTop: 14 }}>
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

          {/* Quick actions */}
          <div className="flex mt-8" style={{ flexWrap: 'wrap' }}>
            {plan?.currentBook && (
              <button className="btn btn-secondary btn-sm" onClick={() => sliderRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })}>
                <IconPages size={14} /> Log reading
              </button>
            )}
            <Link to="/tasks" className="btn btn-secondary btn-sm"><IconZap size={14} /> Add task</Link>
            {currentWeek && !currentWeek.completed && (
              <button className="btn btn-secondary btn-sm" onClick={() => toggleWeek(currentWeek)}><IconCheck size={14} /> Mark week complete</button>
            )}
          </div>
        </div>

        {/* Right column: countdown + pace */}
        <div className="anim-in-3">
          {/* Live countdown */}
          <div className="card mb-16" style={{ background: 'linear-gradient(135deg, var(--primary-soft), transparent 70%)', borderLeft: '4px solid var(--primary)' }}>
            <div className="card-title"><IconCalendar /> {nextMilestone.label}</div>
            <div className="flex" style={{ gap: 10, justifyContent: 'space-between', flexWrap: 'wrap' }}>
              {[
                { v: cd.days, l: 'days' },
                { v: cd.hours, l: 'hrs' },
                { v: cd.mins, l: 'min' },
                { v: cd.secs, l: 'sec' },
              ].map(u => (
                <div key={u.l} style={{ textAlign: 'center', flex: 1, minWidth: 52 }}>
                  <div style={{ fontSize: 26, fontWeight: 900, letterSpacing: '-0.02em', lineHeight: 1.1, fontVariantNumeric: 'tabular-nums' }}>
                    {String(u.v).padStart(2, '0')}
                  </div>
                  <div className="muted" style={{ fontSize: 11 }}>{u.l}</div>
                </div>
              ))}
            </div>
            <div className="muted mt-8" style={{ fontSize: 12, textAlign: 'center' }}>
              {nextDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </div>
          </div>

          {/* Pace */}
          <div className="card mb-16">
            <div className="card-title"><IconTrendUp /> Reading Pace</div>
            <div className="flex-between mb-8">
              <span className="muted" style={{ fontSize: 13 }}>Expected by now</span>
              <strong style={{ fontSize: 13 }}>{plan?.expectedPages?.toLocaleString() ?? 0} pages</strong>
            </div>
            <div className="flex-between mb-8">
              <span className="muted" style={{ fontSize: 13 }}>You've read</span>
              <strong style={{ fontSize: 13 }}>{plan?.pagesRead?.toLocaleString() ?? 0} pages</strong>
            </div>
            <div className={`badge ${paceDiff >= 0 ? 'low' : 'high'} mb-12`}>
              {paceDiff >= 0 ? <><IconTrendUp size={13} /> {paceDiff.toLocaleString()} pages ahead</> : <><IconTrendDown size={13} /> {Math.abs(paceDiff).toLocaleString()} pages behind</>}
            </div>
            {projected && (
              <div className="flex-between" style={{ borderTop: '1px solid var(--border)', paddingTop: 10 }}>
                <span className="muted" style={{ fontSize: 12 }}>Projected finish</span>
                <strong style={{ fontSize: 13 }}>{new Date(projected).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</strong>
              </div>
            )}
          </div>

          {/* Overall progress */}
          <div className="card">
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
        </div>
      </div>

      <div className="grid grid-2 mt-16">
        {/* 7-day activity */}
        <div className="card anim-in-4">
          <div className="card-title flex-between">
            <span>Last 7 days</span>
            <span className="muted" style={{ fontSize: 12, fontWeight: 500 }}>{weekPages} pages this week</span>
          </div>
          <div className="flex" style={{ alignItems: 'flex-end', gap: 8, height: 120, paddingTop: 8 }}>
            {weekDays.map(d => (
              <div key={d.key} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, height: '100%', justifyContent: 'flex-end' }}>
                <div
                  title={`${d.pages} pages · ${d.tasks} tasks`}
                  style={{
                    width: '100%', maxWidth: 34, borderRadius: '8px 8px 3px 3px',
                    background: d.pages > 0 ? 'linear-gradient(180deg, var(--primary), var(--primary-2))' : 'var(--surface-2)',
                    height: `${Math.max((d.pages / maxPages) * 100, 4)}%`,
                    transition: 'height 0.5s var(--ease)',
                    opacity: d.pages > 0 ? 1 : 0.5,
                  }}
                />
                <span className="muted" style={{ fontSize: 11 }}>{d.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Today's focus + tasks */}
        <div className="card anim-in-5">
          <div className="card-title">Today's Focus</div>
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
              {todayTasks.slice(0, 5).map(t => (
                <div key={t.id} className="task-item">
                  <button className="checkbox" onClick={() => api.updateTask(t.id, { completed: 1 }).then(load)} />
                  <div className="task-body">
                    <div className="task-title">{t.title}</div>
                    <div className="task-meta"><span className={`badge ${t.priority}`}>{t.priority}</span></div>
                  </div>
                </div>
              ))}
              {todayTasks.length > 5 && (
                <Link to="/tasks" className="muted mt-8" style={{ fontSize: 13, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  {todayTasks.length - 5} more <IconArrowRight size={13} />
                </Link>
              )}
              {doneToday > 0 && <p className="muted mt-8" style={{ fontSize: 13 }}><IconCheck size={13} /> {doneToday} done today</p>}
            </>
          )}
        </div>
      </div>

      {/* Batch progress strip */}
      <div className="card mt-16 anim-in-6">
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