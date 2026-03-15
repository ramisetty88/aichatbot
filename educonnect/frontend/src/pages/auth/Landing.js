import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Landing.css';

export default function Landing() {
  const navigate = useNavigate();
  return (
    <div className="landing-page">
      <div className="landing-bg">
        <div className="orb orb1"></div>
        <div className="orb orb2"></div>
        <div className="orb orb3"></div>
        <div className="grid"></div>
      </div>
      <div className="landing-content">
        <div className="landing-brand fade-up">
          <div className="brand-logo">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <rect width="48" height="48" rx="14" fill="url(#grad1)"/>
              <path d="M24 10L38 17V27C38 34.7 31.8 41.6 24 43C16.2 41.6 10 34.7 10 27V17L24 10Z" stroke="white" strokeWidth="2.5" fill="none"/>
              <circle cx="24" cy="26" r="6" fill="white" fillOpacity="0.3"/>
              <circle cx="24" cy="26" r="3" fill="white"/>
              <defs>
                <linearGradient id="grad1" x1="0" y1="0" x2="48" y2="48">
                  <stop stopColor="#00c9a7"/>
                  <stop offset="1" stopColor="#00a88e"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div>
            <h1 className="brand-name">EduConnect</h1>
            <p className="brand-tagline">Academic Information System</p>
          </div>
        </div>

        <h2 className="landing-title fade-up" style={{ animationDelay: '0.1s' }}>
          Welcome to the<br />
          <span className="gradient-text">Parent & Admin Portal</span>
        </h2>
        <p className="landing-desc fade-up" style={{ animationDelay: '0.2s' }}>
          Secure, real-time access to student academic information.<br />
          Please select your role to continue.
        </p>

        <div className="role-cards fade-up" style={{ animationDelay: '0.3s' }}>
          <button className="role-card admin-card" onClick={() => navigate('/admin/login')}>
            <div className="role-icon admin-icon">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </div>
            <div className="role-info">
              <h3>Admin Dashboard</h3>
              <p>Manage students, view reports, add & edit records</p>
            </div>
            <div className="role-arrow">→</div>
            <div className="role-badge">ADMIN</div>
          </button>

          <button className="role-card parent-card" onClick={() => navigate('/parent/login')}>
            <div className="role-icon parent-icon">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
                <path d="M12 14v7"/>
                <path d="M9 17h6"/>
              </svg>
            </div>
            <div className="role-info">
              <h3>Parent Portal</h3>
              <p>Track your child's attendance, marks, fees & more</p>
            </div>
            <div className="role-arrow">→</div>
            <div className="role-badge parent-badge">PARENT</div>
          </button>
        </div>

        <div className="landing-features fade-up" style={{ animationDelay: '0.4s' }}>
          {['🔒 Secure Login', '📊 Real-time Data', '💬 Smart Chatbot', '📱 Mobile Friendly'].map(f => (
            <span key={f} className="feature-chip">{f}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
