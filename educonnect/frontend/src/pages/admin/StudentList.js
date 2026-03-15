import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStudents, deleteStudent, toggleStudent } from '../../utils/api';
import AdminLayout from '../../components/admin/AdminLayout';
import './StudentList.css';

const BRANCHES = ['Computer Science & Engineering', 'Electronics & Communication Engineering', 'Mechanical Engineering', 'Civil Engineering', 'Electrical Engineering', 'Information Technology'];

export default function StudentList() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [branch, setBranch] = useState('');
  const [year, setYear] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getStudents({ search, branch, year, page, limit: 10 });
      setStudents(res.data.data);
      setTotalPages(res.data.pages);
      setTotal(res.data.total);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [search, branch, year, page]);

  useEffect(() => { fetchStudents(); }, [fetchStudents]);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete student "${name}"? This cannot be undone.`)) return;
    try { await deleteStudent(id); fetchStudents(); alert('Student deleted.'); }
    catch { alert('Delete failed.'); }
  };

  const handleToggle = async (id) => {
    try { await toggleStudent(id); fetchStudents(); }
    catch { alert('Toggle failed.'); }
  };

  return (
    <AdminLayout>
      <div className="student-list-page">
        {/* Toolbar */}
        <div className="list-toolbar fade-up">
          <div className="toolbar-left">
            <div className="search-box">
              <span>🔍</span>
              <input placeholder="Search name, reg. no, phone..." value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }} />
              {search && <button onClick={() => { setSearch(''); setPage(1); }}>✕</button>}
            </div>
            <select value={branch} onChange={e => { setBranch(e.target.value); setPage(1); }}>
              <option value="">All Branches</option>
              {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
            <select value={year} onChange={e => { setYear(e.target.value); setPage(1); }}>
              <option value="">All Years</option>
              {[1,2,3,4].map(y => <option key={y} value={y}>{y}nd Year</option>)}
            </select>
          </div>
          <button className="btn-add" onClick={() => navigate('/admin/students/add')}>➕ Add Student</button>
        </div>

        <div className="list-meta fade-up">
          Showing <strong>{students.length}</strong> of <strong>{total}</strong> students
        </div>

        {loading ? (
          <div className="list-loading"><span className="spinner"></span> Loading students...</div>
        ) : students.length === 0 ? (
          <div className="list-empty">
            <div className="empty-icon">🎓</div>
            <p>No students found</p>
            <button onClick={() => navigate('/admin/students/add')}>Add First Student</button>
          </div>
        ) : (
          <div className="student-table-wrap fade-up">
            <table className="student-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Reg. No</th>
                  <th>Branch</th>
                  <th>Year</th>
                  <th>CGPA</th>
                  <th>Backlogs</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map(s => (
                  <tr key={s._id}>
                    <td>
                      <div className="student-cell">
                        <div className="student-av">{s.name.charAt(0)}</div>
                        <div>
                          <div className="student-name">{s.name}</div>
                          <div className="student-parent">👤 {s.parentName || '—'}</div>
                        </div>
                      </div>
                    </td>
                    <td><code className="reg-code">{s.registrationNumber}</code></td>
                    <td><span className="branch-text">{s.branch}</span></td>
                    <td><span className="badge badge-blue">{s.year}Y</span></td>
                    <td>
                      <span className={`cgpa-val ${s.cgpa >= 8 ? 'high' : s.cgpa >= 6 ? 'mid' : 'low'}`}>
                        {s.cgpa || '—'}
                      </span>
                    </td>
                    <td>
                      {s.totalBacklogs > 0
                        ? <span className="badge badge-red">{s.totalBacklogs}</span>
                        : <span className="badge badge-green">0</span>}
                    </td>
                    <td>
                      <span className={`badge ${s.isActive ? 'badge-green' : 'badge-red'}`}>
                        {s.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <div className="action-btns">
                        <button className="act-btn view" onClick={() => navigate(`/admin/students/${s._id}`)} title="View">👁️</button>
                        <button className="act-btn edit" onClick={() => navigate(`/admin/students/${s._id}/edit`)} title="Edit">✏️</button>
                        <button className="act-btn toggle" onClick={() => handleToggle(s._id)} title="Toggle Active">
                          {s.isActive ? '🔴' : '🟢'}
                        </button>
                        <button className="act-btn del" onClick={() => handleDelete(s._id, s.name)} title="Delete">🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination fade-up">
            <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button key={p} className={page === p ? 'active' : ''} onClick={() => setPage(p)}>{p}</button>
            ))}
            <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Next →</button>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
