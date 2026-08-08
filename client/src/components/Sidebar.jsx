import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { IconHome, IconPlanner, IconBook, IconTasks, IconFlag, IconClock, IconNote, IconSettings, IconLogout, IconMoon, IconSun } from './Icons.jsx';
import { ProgressBar } from './ui.jsx';
import Logo from './Logo.jsx';
import api from '../api.js';

const nav = [
  { to: '/', label: 'Dashboard', icon: IconHome, end: true },
  { to: '/planner', label: 'Planner', icon: IconPlanner },
  { to: '/books', label: 'Books', icon: IconBook },
  { to: '/tasks', label: 'Tasks', icon: IconTasks },
  { to: '/milestones', label: 'Milestones', icon: IconFlag },
  { to: '/timeline', label: 'GSoC Timeline', icon: IconClock },
  { to: '/notes', label: 'Notes', icon: IconNote }
];

export default function Sidebar({ user, onLogout, theme, onToggleTheme }) {
  const [stats, setStats] = useState(null);
  const initials = (user?.name || 'U').split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();

  useEffect(() => {
    api.stats().then(setStats).catch(() => {});
  }, []);

  const overall = stats?.weeksTotal ? Math.round((stats.weeksDone / stats.weeksTotal) * 100) : 0;

  return (
    <aside className="sidebar">
      <div className="brand">
        <Logo size={38} />
        <div>
          <div className="brand-name">Learn-Grow-Achieve</div>
          <div className="brand-sub">GSoC 2027 Planner</div>
        </div>
      </div>

      <nav className="nav">
        <div className="nav-label">Plan</div>
        {nav.map(({ to, label, icon: Icon, end }) => (
          <NavLink key={to} to={to} end={end} className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
            <Icon />
            <span>{label}</span>
          </NavLink>
        ))}
        <div className="nav-label">Account</div>
        <NavLink to="/settings" className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
          <IconSettings />
          <span>Settings</span>
        </NavLink>
      </nav>

      {stats && (
        <div className="mini-progress">
          <div className="mp-label">
            <span>Overall progress</span>
            <strong>{overall}%</strong>
          </div>
          <ProgressBar value={overall} />
          <div className="mp-label" style={{ marginTop: 8 }}>
            <span>Books</span>
            <strong>{stats.booksDone}/{stats.booksTotal}</strong>
          </div>
          <ProgressBar value={stats.booksTotal ? Math.round((stats.booksDone / stats.booksTotal) * 100) : 0} className="success" />
        </div>
      )}

      <div className="user-card">
        <div className="avatar">{initials}</div>
        <div style={{ minWidth: 0 }}>
          <div className="user-name">{user?.name}</div>
          <div className="user-email">{user?.email}</div>
        </div>
      </div>
      <div className="flex mt-8" style={{ justifyContent: 'space-between' }}>
        <button className="theme-toggle" onClick={onToggleTheme} title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
          {theme === 'dark' ? <IconSun /> : <IconMoon />}
        </button>
        <button className="btn btn-ghost btn-sm" onClick={onLogout} style={{ color: '#8a90b8' }}>
          <IconLogout size={15} /> <span>Sign out</span>
        </button>
      </div>
    </aside>
  );
}