import { IconInbox } from './Icons.jsx';

export function ProgressRing({ value = 0, size = 120, stroke = 10, color = '#6366f1', label }) {  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.min(Math.max(value, 0), 100);
  const offset = c - (pct / 100) * c;
  return (
    <div className="ring-wrap" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--surface-2)" strokeWidth={stroke} />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none"
          stroke={color} strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.5s ease' }}
        />
      </svg>
      <div className="ring-center">
        <div>
          <div className="val">{Math.round(pct)}%</div>
          {label && <div className="lbl">{label}</div>}
        </div>
      </div>
    </div>
  );
}

export function StatCard({ icon, iconBg, value, label, sub }) {
  return (
    <div className="stat-card">
      {icon && <div className="stat-icon" style={{ background: iconBg || 'var(--primary-soft)', color: iconBg ? '#fff' : 'var(--primary)' }}>{icon}</div>}
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
      {sub && <div className="stat-sub">{sub}</div>}
    </div>
  );
}

export function ProgressBar({ value = 0, className = '' }) {
  return (
    <div className="progress-track">
      <div className={`progress-fill ${className}`} style={{ width: `${Math.min(Math.max(value, 0), 100)}%` }} />
    </div>
  );
}

export function Badge({ status }) {
  const map = { todo: 'To do', reading: 'Reading', done: 'Done', high: 'High', medium: 'Medium', low: 'Low' };
  return <span className={`badge ${status}`}>{map[status] || status}</span>;
}

export function Empty({ text }) {
  return (
    <div className="empty">
      <div className="empty-icon"><IconInbox /></div>
      <div className="empty-text">{text}</div>
    </div>
  );
}

export function PageHeader({ title, subtitle, actions }) {
  return (
    <div className="page-header flex-between">
      <div>
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {actions && <div className="flex">{actions}</div>}
    </div>
  );
}