import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './AdminLayout.css';

const navItems = [
  { path: '/admin/dashboard', icon: '📊', label: 'Dashboard' },
  { path: '/admin/students', icon: '🎓', label: 'All Students' },
  { path: '/admin/students/add', icon: '➕', label: 'Add Student' },
];

export default function AdminLayout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => { if (window.confirm('Logout from admin panel?')) { logout(); navigate('/'); } };

  return (
    <div className={`admin-layout ${collapsed ? 'collapsed' : ''}`}>
      {/* Sidebar */}
      <aside className={`admin-sidebar ${mobileOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-top">
          <div className="sidebar-brand">
            <div className="brand-dot"></div>
            {!collapsed && <span className="brand-text">EduConnect</span>}
          </div>
          <button className="collapse-btn" onClick={() => setCollapsed(!collapsed)}>
            {collapsed ? '→' : '←'}
          </button>
        </div>

        {!collapsed && (
          <div className="admin-profile">
            <div className="admin-av">{user?.name?.charAt(0) || 'A'}</div>
            <div>
              <div className="admin-name">{user?.name}</div>
              <div className="admin-role">Administrator</div>
            </div>
          </div>
        )}

        <nav className="sidebar-nav">
          {navItems.map(item => (
            <button
              key={item.path}
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
              onClick={() => { navigate(item.path); setMobileOpen(false); }}
            >
              <span className="nav-icon">{item.icon}</span>
              {!collapsed && <span className="nav-label">{item.label}</span>}
            </button>
          ))}
        </nav>

        <button className="sidebar-logout" onClick={handleLogout}>
          <span>🔒</span>
          {!collapsed && <span>Logout</span>}
        </button>
      </aside>

      {/* Main */}
      <div className="admin-main">
        <header className="admin-header">
          <button className="hamburger-btn" onClick={() => setMobileOpen(!mobileOpen)}>☰</button>
          <div className="header-title">
            {navItems.find(n => n.path === location.pathname)?.label || 'Admin Panel'}
          </div>
          <div className="header-right">
            <span className="header-user">👤 {user?.name}</span>
            <button className="header-logout" onClick={handleLogout}>Logout</button>
          </div>
        </header>
        <div className="admin-body">{children}</div>
      </div>

      {mobileOpen && <div className="sidebar-mask" onClick={() => setMobileOpen(false)} />}
    </div>
  );
}
