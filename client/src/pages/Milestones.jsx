import { useState, useEffect } from 'react';
import api from '../api.js';
import { PageHeader, Empty, ProgressBar, toast } from '../components/ui.jsx';
import { IconCheck, IconFlag, IconCalendar } from '../components/Icons.jsx';

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

  return (
    <div>
      <PageHeader
        title="Milestones"
        subtitle={`${done}/${milestones.length} done — these are the projects that make your proposal stand out.`}
      />

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