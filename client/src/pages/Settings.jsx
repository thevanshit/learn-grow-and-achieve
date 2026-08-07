import { useState } from 'react';
import api from '../api.js';
import { PageHeader } from '../components/ui.jsx';

export default function Settings() {
  const [user] = useState(() => JSON.parse(localStorage.getItem('lga_user') || '{}'));
  const [msg, setMsg] = useState('');
  const [form, setForm] = useState({ name: user.name || '', password: '' });

  const save = async (e) => {
    e.preventDefault();
    try {
      const updated = await api.updateMe(form);
      localStorage.setItem('lga_user', JSON.stringify({ ...user, ...updated }));
      setMsg('Saved!');
      setTimeout(() => setMsg(''), 2000);
    } catch (err) {
      setMsg(err?.message || 'Something went wrong');
    }
  };

  return (
    <div>
      <PageHeader title="Settings" subtitle="Update your profile." />

      <div className="card" style={{ maxWidth: 520 }}>
        <form onSubmit={save}>
          <div className="field">
            <label>Name</label>
            <input className="input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="field">
            <label>New password (leave blank to keep current)</label>
            <input type="password" className="input" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
          </div>
          <button type="submit" className="btn btn-primary">Save changes</button>
          {msg && <div className="muted mt-8" style={{ fontSize: 13 }}>{msg}</div>}
        </form>
      </div>
    </div>
  );
}