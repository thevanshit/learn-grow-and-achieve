import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api.js';
import { IconBook, IconTasks, IconFlag, IconCalendar, IconTarget } from '../components/Icons.jsx';

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
          <div className="auth-brand-logo">
            <div className="auth-logo">L</div>
            <div>
              <div className="auth-brand-name">Learn-Grow-Achieve</div>
              <div className="auth-brand-sub">GSoC 2027 Planner</div>
            </div>
          </div>

          <h2>Your 40-week roadmap to Google Summer of Code 2027</h2>
          <p className="auth-brand-desc">
            A structured plan that takes you from fundamentals to a winning proposal —
            one book, one week, one milestone at a time.
          </p>

          <div className="auth-features">
            <div className="auth-feature">
              <div className="auth-feature-icon"><IconBook /></div>
              <div>
                <div className="auth-feature-title">56 curated books</div>
                <div className="auth-feature-desc">A minimum O'Reilly reading list across 10 batches</div>
              </div>
            </div>
            <div className="auth-feature">
              <div className="auth-feature-icon"><IconTasks /></div>
              <div>
                <div className="auth-feature-title">40 weekly tasks</div>
                <div className="auth-feature-desc">Read and do — tracked with streaks and progress</div>
              </div>
            </div>
            <div className="auth-feature">
              <div className="auth-feature-icon"><IconTarget /></div>
              <div>
                <div className="auth-feature-title">8 portfolio milestones</div>
                <div className="auth-feature-desc">Concrete proof for your GSoC proposal</div>
              </div>
            </div>
          </div>

          <div className="auth-countdown">
            <IconCalendar />
            <span>Org list announced <strong>Feb 8, 2027</strong></span>
          </div>
        </div>
      </div>

      {/* Form panel */}
      <div className="auth-form-panel">
        <div className="auth-card">
          <h1>{isLogin ? 'Welcome back' : 'Create your account'}</h1>
          <p className="sub">
            {isLogin ? 'Sign in to continue your GSoC 2027 journey.' : 'Start your 40-week roadmap to GSoC 2027.'}
          </p>

          <form onSubmit={submit}>
            {!isLogin && (
              <div className="field">
                <label htmlFor="name">Name</label>
                <input id="name" className="input" placeholder="Your name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required autoComplete="name" />
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
              {busy ? 'Please wait…' : isLogin ? 'Sign in' : 'Create account'}
            </button>
          </form>

          <p className="auth-switch">
            {isLogin ? (
              <>New here? <Link to="/register">Create an account</Link></>
            ) : (
              <>Already have an account? <Link to="/login">Sign in</Link></>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}