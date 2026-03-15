import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStats } from '../../utils/api';
import AdminLayout from '../../components/admin/AdminLayout';
import './AdminDashboard.css';

function StatCard({ icon, label, value, sub, color }) {
  return (
    <div className="stat-card fade-up" style={{ '--c': color }}>
      <div className="stat-icon">{icon}</div>
      <div className="stat-body">
        <div className="stat-value">{value}</div>
        <div className="stat-label">{label}</div>
        {sub && <div className="stat-sub">{sub}</div>}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStats().then(r => setStats(r.data.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <AdminLayout>
      <div className="dash-loading"><span className="spinner"></span><span>Loading dashboard...</span></div>
    </AdminLayout>
  );

  return (
    <AdminLayout>
      <div className="dashboard">
        <div className="dash-welcome fade-up">
          <div>
            <h2>Welcome back! 👋</h2>
            <p>Here's an overview of the student management system.</p>
          </div>
          <button className="add-student-btn" onClick={() => navigate('/admin/students/add')}>
            ➕ Add New Student
          </button>
        </div>

        {/* Stats grid */}
        <div className="stats-grid">
          <StatCard icon="🎓" label="Total Students" value={stats?.total ?? 0} color="var(--accent)" />
          <StatCard icon="✅" label="Active Students" value={stats?.active ?? 0} sub={`${stats?.inactive ?? 0} inactive`} color="var(--success)" />
          <StatCard icon="📈" label="Average CGPA" value={stats?.avgCgpa ?? '—'} color="var(--gold)" />
          <StatCard icon="⚠️" label="With Backlogs" value={stats?.withBacklogs ?? 0} color="var(--danger)" />
          <StatCard icon="🚨" label="Low Attendance" value={stats?.lowAttendanceCount ?? 0} sub="Below 75%" color="var(--warning)" />
          <StatCard icon="🏫" label="Branches" value={stats?.branches?.length ?? 0} color="var(--purple)" />
        </div>

        {/* Branch & Year distribution */}
        <div className="dash-bottom">
          <div className="dist-card fade-up">
            <h3>📚 Students by Branch</h3>
            <div className="dist-list">
              {stats?.branches?.map(b => {
                const pct = Math.round((b.count / (stats?.total || 1)) * 100);
                return (
                  <div key={b.name} className="dist-row">
                    <span className="dist-name">{b.name}</span>
                    <div className="dist-bar-wrap">
                      <div className="dist-bar" style={{ width: `${pct}%` }}></div>
                    </div>
                    <span className="dist-count">{b.count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="dist-card fade-up">
            <h3>📅 Students by Year</h3>
            <div className="year-grid">
              {[1, 2, 3, 4].map(y => {
                const found = stats?.yearDist?.find(d => d.year === y);
                return (
                  <div key={y} className="year-tile">
                    <div className="year-num">{y}{['st', 'nd', 'rd', 'th'][y - 1]}</div>
                    <div className="year-val">{found?.count ?? 0}</div>
                    <div className="year-lbl">Year</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="quick-actions fade-up">
          <h3>Quick Actions</h3>
          <div className="action-row">
            {[
              { icon: '➕', label: 'Add Student', path: '/admin/students/add', color: 'var(--accent)' },
              { icon: '📋', label: 'View All Students', path: '/admin/students', color: 'var(--gold)' },
            ].map(a => (
              <button key={a.label} className="action-btn" onClick={() => navigate(a.path)} style={{ '--ac': a.color }}>
                <span className="action-icon">{a.icon}</span>
                <span>{a.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
