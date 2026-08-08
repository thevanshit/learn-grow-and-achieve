import { useEffect, useRef, useState } from 'react';
import { IconInbox, IconCheck, IconSparkles } from './Icons.jsx';

/* ---------- Animated number counter ---------- */
export function CountUp({ value = 0, duration = 900, decimals = 0, suffix = '', prefix = '' }) {
  const [display, setDisplay] = useState(0);
  const prevRef = useRef(0);

  useEffect(() => {
    const from = prevRef.current;
    const to = Number(value) || 0;
    if (from === to) { setDisplay(to); return; }
    const start = performance.now();
    let raf;
    const tick = (now) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
      setDisplay(from + (to - from) * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
      else prevRef.current = to;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);

  const formatted = decimals > 0
    ? display.toFixed(decimals)
    : Math.round(display).toLocaleString();

  return <span>{prefix}{formatted}{suffix}</span>;
}

/* ---------- Progress ring ---------- */
export function ProgressRing({ value = 0, size = 120, stroke = 10, color = '#6366f1', label }) {
  const r = (size - stroke) / 2;
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
          strokeDasharray={c} strokeDashoffset={c - (pct / 100) * c}
        />
      </svg>
      <div className="ring-center">
        <div>
          <div className="val"><CountUp value={pct} suffix="%" /></div>
          {label && <div className="lbl">{label}</div>}
        </div>
      </div>
    </div>
  );
}

/* ---------- Stat card ---------- */
export function StatCard({ icon, iconBg, value, label, sub, animate = true }) {
  return (
    <div className="stat-card">
      {icon && <div className="stat-icon" style={{ background: iconBg || 'var(--primary-soft)', color: iconBg ? '#fff' : 'var(--primary)' }}>{icon}</div>}
      <div className="stat-value">{animate ? value : value}</div>
      <div className="stat-label">{label}</div>
      {sub && <div className="stat-sub">{sub}</div>}
    </div>
  );
}

/* ---------- Progress bar ---------- */
export function ProgressBar({ value = 0, className = '', style, striped = false }) {
  return (
    <div className="progress-track" style={style}>
      <div className={`progress-fill ${className}${striped ? ' striped' : ''}`} style={{ width: `${Math.min(Math.max(value, 0), 100)}%` }} />
    </div>
  );
}

/* ---------- Badge ---------- */
export function Badge({ status }) {
  const map = { todo: 'To do', reading: 'Reading', done: 'Done', high: 'High', medium: 'Medium', low: 'Low' };
  return <span className={`badge ${status}`}>{map[status] || status}</span>;
}

/* ---------- Empty state ---------- */
export function Empty({ text, icon }) {
  return (
    <div className="empty">
      <div className="empty-icon">{icon || <IconInbox />}</div>
      <div className="empty-text">{text}</div>
    </div>
  );
}

/* ---------- Page header ---------- */
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

/* ---------- Toast system ---------- */
let toastQueue = [];
let toastId = 0;

export function toast(message, type = 'success') {
  const id = ++toastId;
  toastQueue.forEach(fn => fn({ id, message, type }));
}

export function ToastHost() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const sub = (item) => {
      setItems(prev => [...prev, item]);
      setTimeout(() => {
        setItems(prev => prev.map(i => i.id === item.id ? { ...i, leaving: true } : i));
        setTimeout(() => setItems(prev => prev.filter(i => i.id !== item.id)), 300);
      }, 3200);
    };
    toastQueue.push(sub);
    return () => { toastQueue = toastQueue.filter(fn => fn !== sub); };
  }, []);

  if (items.length === 0) return null;
  return (
    <div className="toast-wrap">
      {items.map(t => (
        <div key={t.id} className={`toast ${t.type}${t.leaving ? ' leaving' : ''}`}>
          <span className="toast-icon">
            {t.type === 'success' ? <IconCheck size={16} style={{ color: 'var(--success)' }} /> : <IconSparkles size={16} style={{ color: 'var(--primary)' }} />}
          </span>
          {t.message}
        </div>
      ))}
    </div>
  );
}

/* ---------- Confetti ---------- */
const CONFETTI_COLORS = ['#6366f1', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#0ea5e9'];

export function Confetti({ count = 80, trigger = 0 }) {
  const [pieces, setPieces] = useState([]);

  useEffect(() => {
    if (!trigger) return;
    const p = Array.from({ length: count }, (_, i) => ({
      id: `${trigger}-${i}`,
      left: Math.random() * 100,
      delay: Math.random() * 0.4,
      duration: 2.2 + Math.random() * 1.8,
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      size: 7 + Math.random() * 6,
      rotate: Math.random() * 360
    }));
    setPieces(p);
    const t = setTimeout(() => setPieces([]), 5000);
    return () => clearTimeout(t);
  }, [trigger, count]);

  if (pieces.length === 0) return null;
  return (
    <div className="confetti-layer">
      {pieces.map(pc => (
        <div
          key={pc.id}
          className="confetti-piece"
          style={{
            left: `${pc.left}%`,
            width: pc.size,
            height: pc.size * 1.5,
            background: pc.color,
            animationDelay: `${pc.delay}s`,
            animationDuration: `${pc.duration}s`,
            transform: `rotate(${pc.rotate}deg)`
          }}
        />
      ))}
    </div>
  );
}