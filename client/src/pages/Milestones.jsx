import { useState, useEffect } from 'react';
import api from '../api.js';
import { PageHeader, Empty, ProgressBar, StatCard, CountUp, toast } from '../components/ui.jsx';
import { IconCheck, IconFlag, IconCalendar, IconTarget, IconTrophy } from '../components/Icons.jsx';

export default function Milestones({ onCelebrate }) {
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.milestones().then(setMilestones).catch(console.error).finally(() => setLoading(false));
  }, []);

  const toggle = async (m) => {
    const next = !m.completed;
    await api.toggleMilestone(m.id, next);
    if (next) { onCelebrate(); toast(`Milestone ${m.id} complete — portfolio proof.`); }
    setMilestones(ms => ms.map(x => x.id === m.id ? { ...x, completed: next ? 1 : 0 } : x));
  };

  if (loading) return <div className="splash"><div className="spinner" /></div>;

  const done = milestones.filter(m => m.completed).length;
  const pct = milestones.length ? Math.round((done / milestones.length) * 100) : 0;
  const nextUp = milestones.find(m => !m.completed);

  return (
    <div>
      <PageHeader
        title="Milestones"
        subtitle={`${done}/${milestones.length} done — these are the projects that make your proposal stand out.`}
      />

      {/* Top stats */}
      <div className="grid grid-4 mb-24">
        <div className="anim-in-1"><StatCard icon={<IconTrophy />} iconBg="#f59e0b" value={<><CountUp value={done} />/{milestones.length}</>} label="Milestones done" sub="Portfolio proof" /></div>
        <div className="anim-in-2"><StatCard icon={<IconTarget />} iconBg="#6366f1" value={<CountUp value={pct} suffix="%" />} label="Portfolio complete" sub="Proposal-ready when 100%" /></div>
        <div className="anim-in-3"><StatCard icon={<IconFlag />} iconBg="#8b5cf6" value={<CountUp value={milestones.length - done} />} label="Remaining" sub="Keep building" /></div>
        <div className="anim-in-4"><StatCard icon={<IconCalendar />} iconBg="#10b981" value={nextUp ? <CountUp value={nextUp.week} /> : '—'} label="Next target week" sub={nextUp ? nextUp.title : 'All done!'} /></div>
      </div>

      <div className="card mb-16 anim-in-1">
        <div className="flex-between mb-8">
          <span style={{ fontWeight: 700 }}>Portfolio progress</span>
          <span className="muted" style={{ fontSize: 13 }}>{done}/{milestones.length} milestones</span>
        </div>
        <ProgressBar value={pct} className={pct === 100 ? 'success' : ''} striped={pct === 100} />
      </div>

      {milestones.length === 0 ? (
        <Empty text="No milestones yet." icon={<IconFlag />} />
      ) : (
        <div className="grid grid-2">
          {milestones.map((m, i) => (
            <div key={m.id} className={`card anim-in-${Math.min((i % 6) + 1, 6)}`} style={{ borderLeft: m.completed ? '4px solid var(--success)' : '4px solid var(--primary-soft)' }}>
              <div className="flex-between">
                <div className="flex" style={{ gap: 10 }}>
                  <div className="book-num" style={{ background: m.completed ? 'var(--success-soft)' : 'var(--primary-soft)', color: m.completed ? 'var(--success)' : 'var(--primary)' }}>
                    {m.completed ? <IconCheck size={16} /> : `M${m.id}`}
                  </div>
                  <div>
                    <div className="book-title" style={{ fontSize: 15 }}>{m.title}</div>
                    <div className="task-meta">
                      <span><IconCalendar size={12} /> Target: week {m.week}</span>
                      <span><IconFlag size={12} /> {m.books}</span>
                    </div>
                  </div>
                </div>
                <button
                  className={`btn ${m.completed ? 'btn-secondary' : 'btn-primary'} btn-sm`}
                  onClick={() => toggle(m)}
                >
                  {m.completed ? 'Undo' : 'Mark done'}
                </button>
              </div>
              <p className="muted mt-12" style={{ fontSize: 13, lineHeight: 1.55 }}>{m.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}