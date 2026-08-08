import { useState, useEffect } from 'react';
import api from '../api.js';
import { PageHeader, Empty, StatCard, CountUp, toast } from '../components/ui.jsx';
import { IconCheck, IconPlus, IconTrash, IconBook, IconZap, IconPages, IconCalendar } from '../components/Icons.jsx';

const todayStr = () => new Date().toISOString().slice(0, 10);

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [date, setDate] = useState(todayStr());
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', notes: '', due_date: todayStr(), priority: 'medium' });
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.tasks(date), api.plan()])
      .then(([t, p]) => { setTasks(t); setPlan(p); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [date]);

  const toggle = async (t) => {
    const next = !t.completed;
    await api.updateTask(t.id, { completed: next ? 1 : 0 });
    if (next) toast('Task completed.');
    setTasks(ts => ts.map(x => x.id === t.id ? { ...x, completed: next ? 1 : 0 } : x));
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
    toast('Task added');
  };

  const addReadingTask = async () => {
    if (!plan?.today) return;
    const t = plan.today;
    const task = await api.createTask({
      title: `Read pages ${t.fromPage}–${t.toPage} of ${t.book.title}`,
      notes: `${t.pagesToday} pages · Book #${t.book.id}`,
      due_date: todayStr(),
      priority: 'high'
    });
    setTasks(ts => [...ts, task]);
    toast('Reading added to today\'s list');
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

      {/* Top stats */}
      <div className="grid grid-4 mb-24">
        <div className="anim-in-1"><StatCard icon={<IconCheck />} iconBg="#10b981" value={<CountUp value={done} />} label="Done today" sub={`${tasks.length ? Math.round((done / tasks.length) * 100) : 0}% of today's list`} /></div>
        <div className="anim-in-2"><StatCard icon={<IconZap />} iconBg="#f59e0b" value={<CountUp value={pending.length} />} label="Pending" sub="Still to knock out" /></div>
        <div className="anim-in-3"><StatCard icon={<IconBook />} iconBg="#6366f1" value={plan?.today ? <CountUp value={plan.today.pagesToday} /> : '—'} label="Pages to read today" sub={plan?.today ? plan.today.book.title : 'No reading assigned'} /></div>
        <div className="anim-in-4"><StatCard icon={<IconCalendar />} iconBg="#8b5cf6" value={plan ? <CountUp value={plan.daysRemaining} /> : '—'} label="Days to Feb 1" sub="Reading deadline" /></div>
      </div>

      {plan?.today && (
        <div className="card mb-16 reading-banner anim-in-1">
          <div className="flex-between" style={{ gap: 12 }}>
            <div className="flex" style={{ gap: 10, alignItems: 'center' }}>
              <IconBook size={18} />
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>Today's reading: pages {plan.today.fromPage}–{plan.today.toPage} of {plan.today.book.title}</div>
                <div className="muted" style={{ fontSize: 12 }}>{plan.today.pagesToday} pages · {plan.pagesPerDay} pages/day pace · {plan.daysRemaining} days to Feb 1, 2027</div>
              </div>
            </div>
            <button className="btn btn-primary btn-sm" onClick={addReadingTask}><IconPlus size={14} /> Add as task</button>
          </div>
        </div>
      )}

      {showForm && (
        <div className="card mb-16 anim-pop">
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
        <Empty text="Nothing on this day. Add a task and keep the streak alive." />
      ) : (
        <>
          {pending.map((t, i) => (
            <div key={t.id} className={`task-item anim-in-${Math.min((i % 6) + 1, 6)}`}>
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