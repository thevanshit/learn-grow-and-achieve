import { useState, useEffect } from 'react';
import api from '../api.js';
import { PageHeader, Empty, StatCard, CountUp, toast } from '../components/ui.jsx';
import { IconPlus, IconTrash, IconNote, IconSparkles, IconClock, IconBook } from '../components/Icons.jsx';

export default function Notes() {
  const [notes, setNotes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', content: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.notes().then(setNotes).catch(console.error).finally(() => setLoading(false));
  }, []);

  const create = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    const note = await api.createNote(form);
    setNotes(ns => [note, ...ns]);
    setForm({ title: '', content: '' });
    setShowForm(false);
    toast('Note saved');
  };

  const remove = async (id) => {
    await api.deleteNote(id);
    setNotes(ns => ns.filter(n => n.id !== id));
  };

  if (loading) return <div className="splash"><div className="spinner" /></div>;

  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 86400000);
  const monthAgo = new Date(now.getTime() - 30 * 86400000);
  const thisWeek = notes.filter(n => new Date(n.created_at) >= weekAgo).length;
  const thisMonth = notes.filter(n => new Date(n.created_at) >= monthAgo).length;
  const words = notes.reduce((s, n) => s + (n.content || '').split(/\s+/).filter(Boolean).length, 0);

  return (
    <div>
      <PageHeader
        title="Notes"
        subtitle="Ideas, learnings, org research — keep it all here."
        actions={<button className="btn btn-primary" onClick={() => setShowForm(s => !s)}><IconPlus size={16} /> New note</button>}
      />

      {/* Top stats */}
      <div className="grid grid-4 mb-24">
        <div className="anim-in-1"><StatCard icon={<IconNote />} iconBg="#6366f1" value={<CountUp value={notes.length} />} label="Total notes" sub="Your knowledge base" /></div>
        <div className="anim-in-2"><StatCard icon={<IconSparkles />} iconBg="#8b5cf6" value={<CountUp value={thisWeek} />} label="This week" sub={`${thisMonth} in the last 30 days`} /></div>
        <div className="anim-in-3"><StatCard icon={<IconBook />} iconBg="#10b981" value={<CountUp value={words} />} label="Words captured" sub="Ideas written down" /></div>
        <div className="anim-in-4"><StatCard icon={<IconClock />} iconBg="#f59e0b" value={notes.length ? <CountUp value={Math.max(1, Math.round(notes.length / Math.max(1, Math.floor((now - new Date(notes[notes.length - 1].created_at)) / 86400000) + 1)))} /> : '—'} label="Notes / day" sub="Writing habit" /></div>
      </div>

      {showForm && (
        <div className="card mb-16 anim-pop">
          <form onSubmit={create}>
            <div className="field">
              <label>Title</label>
              <input className="input" placeholder="Note title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} autoFocus />
            </div>
            <div className="field">
              <label>Content</label>
              <textarea className="textarea" rows={5} placeholder="Write your note…" value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} />
            </div>
            <div className="flex">
              <button type="submit" className="btn btn-primary">Save note</button>
              <button type="button" className="btn btn-ghost" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {notes.length === 0 ? (
        <Empty text="No notes yet. Capture your first idea." icon={<IconNote />} />
      ) : (
        <div className="grid grid-2">
          {notes.map((n, i) => (
            <div key={n.id} className={`card anim-in-${Math.min((i % 6) + 1, 6)}`}>
              <div className="flex-between">
                <div className="card-title" style={{ marginBottom: 0 }}>{n.title || 'Untitled'}</div>
                <button className="btn btn-ghost btn-sm" onClick={() => remove(n.id)}><IconTrash size={15} /></button>
              </div>
              <p className="muted mt-8" style={{ fontSize: 13, whiteSpace: 'pre-wrap' }}>{n.content}</p>
              <div className="muted mt-8" style={{ fontSize: 11 }}>{new Date(n.created_at).toLocaleString()}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}