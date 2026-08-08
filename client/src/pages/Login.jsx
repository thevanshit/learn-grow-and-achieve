import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api.js';
import Logo from '../components/Logo.jsx';
import { IconBook, IconTasks, IconCalendar, IconTarget, IconSparkles, IconZap } from '../components/Icons.jsx';

export default function Login({ mode, onAuth }) {
  const isLogin = mode === 'login';
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const data = isLogin
        ? await api.login({ email: form.email, password: form.password })
        : await api.register(form);
      localStorage.setItem('lga_token', data.token);
      localStorage.setItem('lga_user', JSON.stringify(data.user));
      onAuth(data.user);
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth-wrap">
      {/* Brand panel */}
      <div className="auth-brand">
        <div className="auth-brand-inner">
          <div className="auth-brand-logo anim-in">
            <Logo size={44} />
            <div>
              <div className="auth-brand-name">Learn-Grow-Achieve</div>
              <div className="auth-brand-sub">GSoC 2027 Planner</div>
            </div>
          </div>

          <h2 className="anim-in-1">77 books. 40 weeks. One goal: GSoC 2027.</h2>
          <p className="auth-brand-desc anim-in-2">
            A structured path from your first commit to a proposal worth accepting —
            with a daily reading target that keeps you on pace, every single day.
          </p>

          <div className="auth-features">
            <div className="auth-feature anim-in-3">
              <div className="auth-feature-icon"><IconBook /></div>
              <div>
                <div className="auth-feature-title">77 hand-picked books</div>
                <div className="auth-feature-desc">From Git basics to system design, in 11 focused batches</div>
              </div>
            </div>
            <div className="auth-feature anim-in-4">
              <div className="auth-feature-icon"><IconTasks /></div>
              <div>
                <div className="auth-feature-title">A daily reading plan</div>
                <div className="auth-feature-desc">~100 pages a day, tracked with streaks and progress</div>
              </div>
            </div>
            <div className="auth-feature anim-in-5">
              <div className="auth-feature-icon"><IconTarget /></div>
              <div>
                <div className="auth-feature-title">11 portfolio milestones</div>
                <div className="auth-feature-desc">Real projects that make your proposal stand out</div>
              </div>
            </div>
          </div>

          <div className="auth-countdown anim-in-6">
            <IconCalendar />
            <span>Org list drops <strong>Feb 8, 2027</strong> — you have 6 months</span>
          </div>
        </div>
      </div>

      {/* Form panel */}
      <div className="auth-form-panel">
        <div className="auth-card">
          <h1>{isLogin ? 'Welcome back' : 'Let\'s get started'}</h1>
          <p className="sub">
            {isLogin ? 'Pick up where you left off. Your streak is waiting.' : 'Your 6-month countdown starts now.'}
          </p>

          <form onSubmit={submit}>
            {!isLogin && (
              <div className="field">
                <label htmlFor="name">Name</label>
                <input id="name" className="input" placeholder="What should we call you?" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required autoComplete="name" />
              </div>
            )}
            <div className="field">
              <label htmlFor="email">Email</label>
              <input id="email" type="email" className="input" placeholder="you@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required autoComplete="email" />
            </div>
            <div className="field">
              <label htmlFor="password">Password</label>
              <input id="password" type="password" className="input" placeholder="At least 6 characters" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required minLength={6} autoComplete={isLogin ? 'current-password' : 'new-password'} />
            </div>

            {error && <div className="alert">{error}</div>}

            <button type="submit" className="btn btn-primary btn-block" disabled={busy}>
              {busy ? 'One sec…' : isLogin ? 'Sign in' : 'Create my plan'}
              {!busy && <IconSparkles size={16} />}
            </button>
          </form>

          <p className="auth-switch">
            {isLogin ? (
              <>New here? <Link to="/register">Create an account</Link></>
            ) : (
              <>Already have an account? <Link to="/login">Sign in</Link></>
            )}
          </p>

          <p className="muted mt-16" style={{ fontSize: 12, textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            <IconZap size={13} /> No spam. No emails. Just your plan.
          </p>
        </div>
      </div>
    </div>
  );
}