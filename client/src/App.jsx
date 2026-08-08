import { useState, useEffect, useCallback } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Planner from './pages/Planner.jsx';
import Books from './pages/Books.jsx';
import Tasks from './pages/Tasks.jsx';
import Milestones from './pages/Milestones.jsx';
import Timeline from './pages/Timeline.jsx';
import Notes from './pages/Notes.jsx';
import Settings from './pages/Settings.jsx';
import Login from './pages/Login.jsx';
import { ToastHost, Confetti } from './components/ui.jsx';
import { api } from './api.js';

function getInitialTheme() {
  const saved = localStorage.getItem('lga_theme');
  if (saved) return saved;
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export default function App() {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('lga_user') || 'null'));
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState(getInitialTheme);
  const [celebrate, setCelebrate] = useState(0);
  const location = useLocation();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('lga_theme', theme);
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#0d0f1c' : '#6366f1');
  }, [theme]);

  useEffect(() => {
    const token = localStorage.getItem('lga_token');
    if (!token) { setLoading(false); return; }
    api.me()
      .then(({ user }) => { setUser(user); localStorage.setItem('lga_user', JSON.stringify(user)); })
      .catch(() => { localStorage.removeItem('lga_token'); localStorage.removeItem('lga_user'); setUser(null); })
      .finally(() => setLoading(false));
  }, []);

  const celebrateNow = useCallback(() => setCelebrate(c => c + 1), []);

  if (loading) {
    return (
      <div className="splash">
        <div className="spinner" />
      </div>
    );
  }

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  if (!user && !isAuthPage) return <Navigate to="/login" replace />;
  if (user && isAuthPage) return <Navigate to="/" replace />;

  return (
    <div className="app-shell">
      <div className="bg-orbs" aria-hidden="true">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
      </div>
      {user && <Sidebar user={user} onLogout={() => { setUser(null); localStorage.clear(); }} theme={theme} onToggleTheme={() => setTheme(t => t === 'dark' ? 'light' : 'dark')} />}
      <main className={`main${user ? '' : ' main-auth'}`}>
        <div key={location.pathname} className="page-enter">
          <Routes location={location}>
            <Route path="/" element={<Dashboard onCelebrate={celebrateNow} />} />
            <Route path="/planner" element={<Planner onCelebrate={celebrateNow} />} />
            <Route path="/books" element={<Books />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/milestones" element={<Milestones onCelebrate={celebrateNow} />} />
            <Route path="/timeline" element={<Timeline />} />
            <Route path="/notes" element={<Notes />} />
            <Route path="/settings" element={<Settings user={user} onLogout={() => { setUser(null); localStorage.clear(); }} theme={theme} onToggleTheme={() => setTheme(t => t === 'dark' ? 'light' : 'dark')} />} />
            <Route path="/login" element={<Login mode="login" onAuth={setUser} />} />
            <Route path="/register" element={<Login mode="register" onAuth={setUser} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </main>
      <ToastHost />
      <Confetti trigger={celebrate} />
    </div>
  );
}