import { useState, useEffect } from 'react';
import api from '../api.js';
import { PageHeader, Empty } from '../components/ui.jsx';
import { IconCheck, IconPlus, IconTrash } from '../components/Icons.jsx';

const todayStr = () => new Date().toISOString().slice(0, 10);

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [date, setDate] = useState(todayStr());
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', notes: '', due_date: todayStr(), priority: 'medium' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.tasks(date).then(setTasks).catch(console.error).finally(() => setLoading(false));
  }, [date]);

  const toggle = async (t) => {
    await api.updateTask(t.id, { completed: t.completed ? 0 : 1 });
    setTasks(ts => ts.map(x => x.id === t.id ? { ...x, completed: x.completed ? 0 : 1 } : x));
  };

  const remove = async (id) => {
    await api.deleteTask(id);
    setTasks(ts => ts.filter(x => x.id !== id));
  };

  const create = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    const task = await api.createTask(form);
    setTasks(ts => [...ts, task]);
    setForm({ title: '', notes: '', due_date: todayStr(), priority: 'medium' });
    setShowForm(false);
  };

  if (loading) return <div className="splash"><div className="spinner" /></div>;

  const done = tasks.filter(t => t.completed).length;
  const pending = tasks.filter(t => !t.completed);

  return (
    <div>
      <PageHeader
        title="Tasks"
        subtitle={`${done} done · ${pending.length} pending on ${date}`}
        actions={
          <div className="flex">
            <input type="date" className="input" style={{ width: 'auto' }} value={date} onChange={e => setDate(e.target.value)} />
            <button className="btn btn-primary" onClick={() => setShowForm(s => !s)}><IconPlus size={16} /> Add task</button>
          </div>
        }
      />

      {showForm && (
        <div className="card mb-16">
          <form onSubmit={create}>
            <div className="field">
              <label>Task title</label>
              <input className="input" placeholder="e.g. Finish Chapter 3 of Hands-On LLMs" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} autoFocus />
            </div>
            <div className="field">
              <label>Notes</label>
              <textarea className="textarea" placeholder="Optional details…" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
            </div>
            <div className="grid grid-2">
              <div className="field">
                <label>Due date</label>
                <input type="date" className="input" value={form.due_date} onChange={e => setForm({ ...form, due_date: e.target.value })} />
              </div>
              <div className="field">
                <label>Priority</label>
                <select className="select" value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>
            <div className="flex">
              <button type="submit" className="btn btn-primary">Create task</button>
              <button type="button" className="btn btn-ghost" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {tasks.length === 0 ? (
        <Empty text="No tasks for this day. Add one to keep your streak alive." />
      ) : (
        <>
          {pending.map(t => (
            <div key={t.id} className="task-item">
              <button className="checkbox" onClick={() => toggle(t)} aria-label="Complete" />
              <div className="task-body">
                <div className="task-title">{t.title}</div>
                <div className="task-meta">
                  <span className={`badge ${t.priority}`}>{t.priority}</span>
                  {t.due_date && <span>Due {t.due_date}</span>}
                  {t.notes && <span>{t.notes}</span>}
                </div>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={() => remove(t.id)}><IconTrash size={15} /></button>
            </div>
          ))}
          {done > 0 && (
            <>
              <div className="muted mt-16 mb-8" style={{ fontSize: 13, fontWeight: 600 }}>Completed</div>
              {tasks.filter(t => t.completed).map(t => (
                <div key={t.id} className="task-item done">
                  <button className="checkbox checked" onClick={() => toggle(t)} aria-label="Uncomplete"><IconCheck size={13} /></button>
                  <div className="task-body">
                    <div className="task-title">{t.title}</div>
                    <div className="task-meta"><span className={`badge ${t.priority}`}>{t.priority}</span></div>
                  </div>
                  <button className="btn btn-ghost btn-sm" onClick={() => remove(t.id)}><IconTrash size={15} /></button>
                </div>
              ))}
            </>
          )}
        </>
      )}
    </div>
  );
}