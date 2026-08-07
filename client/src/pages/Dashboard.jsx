import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api.js';
import { ProgressRing, StatCard, ProgressBar, Empty } from '../components/ui.jsx';
import { IconFire, IconBook, IconTasks, IconFlag, IconRocket, IconCheck, IconCalendar, IconTarget } from '../components/Icons.jsx';

const todayStr = () => new Date().toISOString().slice(0, 10);

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [batches, setBatches] = useState([]);
  const [weeks, setWeeks] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.stats(), api.batches(), api.weeks(), api.tasks(todayStr())])
      .then(([s, b, w, t]) => { setStats(s); setBatches(b); setWeeks(w); setTasks(t); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="splash"><div className="spinner" /></div>;

  const user = JSON.parse(localStorage.getItem('lga_user') || '{}');
  const firstName = (user.name || 'there').split(' ')[0];
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  const overall = stats.weeksTotal ? Math.round((stats.weeksDone / stats.weeksTotal) * 100) : 0;
  const overallPct = overall;
  const booksPct = stats.booksTotal ? Math.round((stats.booksDone / stats.booksTotal) * 100) : 0;
  const milestonePct = stats.milestonesTotal ? Math.round((stats.milestonesDone / stats.milestonesTotal) * 100) : 0;

  const currentWeek = weeks.find(w => w.week === stats.currentWeek);
  const nextWeek = weeks.find(w => w.week === stats.currentWeek + 1);
  const todayTasks = tasks.filter(t => !t.completed);
  const doneToday = tasks.filter(t => t.completed).length;

  return (
    <div>
      <div className="page-header">
        <h1>Good {greeting()}, {firstName} 👋</h1>
        <p>{today} · Week {stats.currentWeek} of 40 · {stats.streak > 0 ? `${stats.streak}-day streak 🔥` : 'Start your streak today!'}</p>
      </div>

      {/* Top stats */}
      <div className="grid grid-4 mb-24">
        <StatCard icon={<IconFire />} iconBg="#f97316" value={stats.streak} label="Day streak" sub="Keep it alive daily" />
        <StatCard icon={<IconBook />} value={`${stats.booksDone}/${stats.booksTotal}`} label="Books done" sub={`${stats.booksReading} currently reading`} />
        <StatCard icon={<IconTasks />} value={`${stats.weeksDone}/${stats.weeksTotal}`} label="Weeks completed" sub={`${stats.tasksTodayDone}/${stats.tasksToday} tasks today`} />
        <StatCard icon={<IconFlag />} value={`${stats.milestonesDone}/${stats.milestonesTotal}`} label="Milestones" sub="Portfolio proof" />
      </div>

      <div className="grid grid-2">
        {/* Today's focus */}
        <div className="card">
          <div className="card-title"><IconTarget /> Today's Focus</div>
          {currentWeek ? (
            <div className="mb-16">
              <div className="badge reading mb-8">Week {currentWeek.week} · {currentWeek.title}</div>
              <p className="muted" style={{ fontSize: 13 }}><strong>Read:</strong> {currentWeek.read}</p>
              <p className="muted mt-8" style={{ fontSize: 13 }}><strong>Do:</strong> {currentWeek.do}</p>
              <button
                className={`btn ${currentWeek.completed ? 'btn-secondary' : 'btn-primary'} mt-16`}
                onClick={() => api.toggleWeek(currentWeek.id, !currentWeek.completed).then(() => window.location.reload())}
              >
                {currentWeek.completed ? '✓ Week completed' : 'Mark week complete'}
              </button>
            </div>
          ) : <Empty emoji="🎉" text="You finished the 40-week plan!" />}

          <div className="card-title mt-16" style={{ marginBottom: 8 }}>Today's Tasks</div>
          {todayTasks.length === 0 && doneToday === 0 ? (
            <Empty emoji="☀️" text="No tasks for today. Add some in Tasks." />
          ) : (
            <>
              {todayTasks.slice(0, 4).map(t => (
                <div key={t.id} className="task-item">
                  <button className="checkbox" onClick={() => api.updateTask(t.id, { completed: 1 }).then(() => window.location.reload())} />
                  <div className="task-body">
                    <div className="task-title">{t.title}</div>
                    <div className="task-meta"><span className={`badge ${t.priority}`}>{t.priority}</span></div>
                  </div>
                </div>
              ))}
              {doneToday > 0 && <p className="muted mt-8" style={{ fontSize: 13 }}>✓ {doneToday} done today</p>}
            </>
          )}
        </div>

        {/* Progress + countdown */}
        <div>
          <div className="card mb-16">
            <div className="card-title">Overall Progress</div>
            <div className="flex" style={{ gap: 24 }}>
              <ProgressRing value={overallPct} label="overall" />
              <div style={{ flex: 1 }}>
                <div className="mb-12">
                  <div className="flex-between mb-8"><span className="muted" style={{ fontSize: 13 }}>Weeks</span><strong>{stats.weeksDone}/{stats.weeksTotal}</strong></div>
                  <ProgressBar value={overallPct} />
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
      <div className="card mt-16">
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