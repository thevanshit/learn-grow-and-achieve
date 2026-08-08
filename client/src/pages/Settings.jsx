import { useState } from 'react';
import api from '../api.js';
import { PageHeader, toast } from '../components/ui.jsx';
import { IconMoon, IconSun, IconLogout } from '../components/Icons.jsx';

export default function Settings({ user, onLogout, theme, onToggleTheme }) {
  const [msg, setMsg] = useState('');
  const [form, setForm] = useState({ name: user.name || '', password: '' });

  const save = async (e) => {
    e.preventDefault();
    try {
      const updated = await api.updateMe(form);
      localStorage.setItem('lga_user', JSON.stringify({ ...user, ...updated }));
      setMsg('Saved!');
      toast('Profile updated');
      setTimeout(() => setMsg(''), 2000);
    } catch (err) {
      setMsg(err?.message || 'Something went wrong');
    }
  };

  return (
    <div>
      <PageHeader title="Settings" subtitle="Your profile, your theme." />

      <div className="grid grid-2">
        <div className="card anim-in-1" style={{ maxWidth: 520 }}>
          <div className="card-title">Profile</div>
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

        <div>
          <div className="card anim-in-2">
            <div className="card-title">Appearance</div>
            <div className="flex-between">
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>Dark mode</div>
                <div className="muted" style={{ fontSize: 12 }}>Easier on the eyes for late-night reading sessions</div>
              </div>
              <button className="btn btn-secondary" onClick={onToggleTheme}>
                {theme === 'dark' ? <><IconSun size={15} /> Light mode</> : <><IconMoon size={15} /> Dark mode</>}
              </button>
            </div>
          </div>

          <div className="card anim-in-3">
            <div className="card-title">Account</div>
            <button className="btn btn-danger" onClick={onLogout}><IconLogout size={15} /> Sign out</button>
          </div>
        </div>
      </div>
    </div>
  );
}