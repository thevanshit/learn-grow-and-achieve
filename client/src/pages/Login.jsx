import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api.js';

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
      <div className="auth-card">
        <div className="auth-logo">L</div>
        <h1>{isLogin ? 'Welcome back' : 'Create your account'}</h1>
        <p className="muted">
          {isLogin ? 'Sign in to continue your GSoC 2027 journey.' : 'Start your 40-week roadmap to GSoC 2027.'}
        </p>

        <form onSubmit={submit}>
          {!isLogin && (
            <div className="field">
              <label>Name</label>
              <input className="input" placeholder="Your name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
            </div>
          )}
          <div className="field">
            <label>Email</label>
            <input type="email" className="input" placeholder="you@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div className="field">
            <label>Password</label>
            <input type="password" className="input" placeholder="••••••••" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required minLength={6} />
          </div>

          {error && <div className="alert">{error}</div>}

          <button type="submit" className="btn btn-primary btn-block" disabled={busy}>
            {busy ? 'Please wait…' : isLogin ? 'Sign in' : 'Create account'}
          </button>
        </form>

        <p className="muted" style={{ textAlign: 'center', marginTop: 16, fontSize: 14 }}>
          {isLogin ? (
            <>New here? <Link to="/register">Create an account</Link></>
          ) : (
            <>Already have an account? <Link to="/login">Sign in</Link></>
          )}
        </p>
      </div>
    </div>
  );
}