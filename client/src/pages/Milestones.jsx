import { useState, useEffect } from 'react';
import api from '../api.js';
import { PageHeader, Empty } from '../components/ui.jsx';
import { IconCheck } from '../components/Icons.jsx';

export default function Milestones() {
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.milestones().then(setMilestones).catch(console.error).finally(() => setLoading(false));
  }, []);

  const toggle = async (m) => {
    const next = !m.completed;
    await api.toggleMilestone(m.id, next);
    setMilestones(ms => ms.map(x => x.id === m.id ? { ...x, completed: next ? 1 : 0 } : x));
  };

  if (loading) return <div className="splash"><div className="spinner" /></div>;

  const done = milestones.filter(m => m.completed).length;

  return (
    <div>
      <PageHeader
        title="Milestones"
        subtitle={`${done}/${milestones.length} completed — these are your portfolio proof for GSoC 2027.`}
      />

      {milestones.length === 0 ? (
        <Empty emoji="🏁" text="No milestones yet." />
      ) : (
        <div className="card" style={{ padding: 12 }}>
          {milestones.map(m => (
            <div key={m.id} className={`task-item${m.completed ? ' done' : ''}`}>
              <button className={`checkbox${m.completed ? ' checked' : ''}`} onClick={() => toggle(m)} aria-label="Toggle milestone">
                {m.completed && <IconCheck size={13} />}
              </button>
              <div className="task-body">
                <div className="task-title">M{m.id} · {m.title}</div>
                <div className="task-meta"><strong>Deliverable:</strong> {m.description}</div>
                <div className="task-meta"><strong>Books:</strong> {m.books} · <strong>Target week:</strong> {m.week}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}