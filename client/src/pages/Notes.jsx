import { useState, useEffect } from 'react';
import api from '../api.js';
import { PageHeader, Empty, toast } from '../components/ui.jsx';
import { IconPlus, IconTrash, IconNote } from '../components/Icons.jsx';

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

  return (
    <div>
      <PageHeader
        title="Notes"
        subtitle="Ideas, learnings, org research — keep it all here."
        actions={<button className="btn btn-primary" onClick={() => setShowForm(s => !s)}><IconPlus size={16} /> New note</button>}
      />

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