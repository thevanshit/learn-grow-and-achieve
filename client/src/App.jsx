import { useState, useEffect } from 'react';
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
import { api } from './api.js';

export default function App() {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('lga_user') || 'null'));
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('lga_token');
    if (!token) { setLoading(false); return; }
    api.me()
      .then(({ user }) => { setUser(user); localStorage.setItem('lga_user', JSON.stringify(user)); })
      .catch(() => { localStorage.removeItem('lga_token'); localStorage.removeItem('lga_user'); setUser(null); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="splash"><div className="spinner" /></div>;
  }

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  if (!user && !isAuthPage) return <Navigate to="/login" replace />;
  if (user && isAuthPage) return <Navigate to="/" replace />;

  return (
    <div className="app-shell">
      {user && <Sidebar user={user} onLogout={() => { setUser(null); localStorage.clear(); }} />}
      <main className="main">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/planner" element={<Planner />} />
          <Route path="/books" element={<Books />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/milestones" element={<Milestones />} />
          <Route path="/timeline" element={<Timeline />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/settings" element={<Settings user={user} onLogout={() => { setUser(null); localStorage.clear(); }} />} />
          <Route path="/login" element={<Login mode="login" onAuth={setUser} />} />
          <Route path="/register" element={<Login mode="register" onAuth={setUser} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}