import { NavLink } from 'react-router-dom';
import { IconHome, IconPlanner, IconBook, IconTasks, IconFlag, IconClock, IconNote, IconSettings, IconLogout } from './Icons.jsx';

const nav = [
  { to: '/', label: 'Dashboard', icon: IconHome, end: true },
  { to: '/planner', label: 'Planner', icon: IconPlanner },
  { to: '/books', label: 'Books', icon: IconBook },
  { to: '/tasks', label: 'Tasks', icon: IconTasks },
  { to: '/milestones', label: 'Milestones', icon: IconFlag },
  { to: '/timeline', label: 'GSoC Timeline', icon: IconClock },
  { to: '/notes', label: 'Notes', icon: IconNote }
];

export default function Sidebar({ user, onLogout }) {
  const initials = (user?.name || 'U').split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-logo">L</div>
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

      <div className="user-card">
        <div className="avatar">{initials}</div>
        <div style={{ minWidth: 0 }}>
          <div className="user-name">{user?.name}</div>
          <div className="user-email">{user?.email}</div>
        </div>
      </div>
      <button className="btn btn-ghost btn-sm mt-8" onClick={onLogout} style={{ color: '#8a90b8' }}>
        <IconLogout size={15} /> <span>Sign out</span>
      </button>
    </aside>
  );
}