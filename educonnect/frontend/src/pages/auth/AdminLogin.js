import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminLogin } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import './AuthPages.css';

export default function AdminLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPw, setShowPw] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const res = await adminLogin(form);
      login(res.data.token, res.data.admin, 'admin');
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg">
        <div className="orb gold-orb"></div>
        <div className="grid"></div>
      </div>
      <div className="auth-container fade-up">
        <button className="back-btn" onClick={() => navigate('/')}>← Back</button>

        <div className="auth-header">
          <div className="auth-icon admin-auth-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>
          <div>
            <h1>Admin Login</h1>
            <p>Sign in to manage the student portal</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="field">
            <label>Email Address</label>
            <div className="input-wrap">
              <span className="icon">📧</span>
              <input type="email" placeholder="admin@college.edu" value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })} required />
            </div>
          </div>
          <div className="field">
            <label>Password</label>
            <div className="input-wrap">
              <span className="icon">🔐</span>
              <input type={showPw ? 'text' : 'password'} placeholder="Enter password" value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })} required />
              <button type="button" className="toggle-pw" onClick={() => setShowPw(!showPw)}>
                {showPw ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {error && <div className="error-box">⚠️ {error}</div>}

          <button type="submit" className="submit-btn admin-btn" disabled={loading}>
            {loading ? <span className="spinner"></span> : '🔑 Sign In to Admin'}
          </button>
        </form>

        <div className="demo-box admin-demo">
          <strong>Demo Credentials</strong><br />
          Email: admin@college.edu<br />
          Password: admin123
        </div>
      </div>
    </div>
  );
}
