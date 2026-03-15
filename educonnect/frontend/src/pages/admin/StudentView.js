import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getStudent, deleteStudent } from '../../utils/api';
import AdminLayout from '../../components/admin/AdminLayout';
import './StudentView.css';

function Section({ title, children }) {
  return <div className="view-section"><h3>{title}</h3>{children}</div>;
}
function Row({ label, value }) {
  return <div className="view-row"><span className="view-label">{label}</span><span className="view-val">{value || '—'}</span></div>;
}

export default function StudentView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStudent(id).then(r => setStudent(r.data.data)).catch(() => alert('Failed to load.')).finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm(`Delete ${student.name}? This cannot be undone.`)) return;
    try { await deleteStudent(id); navigate('/admin/students'); }
    catch { alert('Delete failed.'); }
  };

  if (loading) return <AdminLayout><div className="view-loading"><span className="spinner"></span> Loading...</div></AdminLayout>;
  if (!student) return <AdminLayout><div className="view-loading">Student not found.</div></AdminLayout>;

  const latestSem = student.semesters?.[student.semesters.length - 1];

  return (
    <AdminLayout>
      <div className="student-view">
        {/* Back & actions */}
        <div className="view-topbar fade-up">
          <button className="back-link" onClick={() => navigate('/admin/students')}>← Back to Students</button>
          <div className="view-actions">
            <button className="btn-edit" onClick={() => navigate(`/admin/students/${id}/edit`)}>✏️ Edit Student</button>
            <button className="btn-delete" onClick={handleDelete}>🗑️ Delete</button>
          </div>
        </div>

        {/* Profile card */}
        <div className="profile-hero fade-up">
          <div className="hero-av">{student.name.charAt(0)}</div>
          <div className="hero-info">
            <div className="hero-name">{student.name}</div>
            <div className="hero-reg">{student.registrationNumber}</div>
            <div className="hero-branch">{student.branch} · {student.year}nd Year · Sec {student.section}</div>
          </div>
          <div className="hero-stats">
            <div className="hstat"><div className="hstat-val">{student.cgpa || '—'}</div><div className="hstat-lbl">CGPA</div></div>
            <div className="hstat"><div className={`hstat-val ${student.totalBacklogs > 0 ? 'danger' : 'success'}`}>{student.totalBacklogs}</div><div className="hstat-lbl">Backlogs</div></div>
            <div className="hstat"><div className={`hstat-val ${student.isActive ? 'success' : 'danger'}`}>{student.isActive ? 'Active' : 'Inactive'}</div><div className="hstat-lbl">Status</div></div>
            <div className="hstat"><div className="hstat-val">{student.semesters?.length || 0}</div><div className="hstat-lbl">Semesters</div></div>
          </div>
        </div>

        <div className="view-grid">
          <Section title="👤 Personal Info">
            <Row label="Email" value={student.email} />
            <Row label="Date of Birth" value={student.dob ? new Date(student.dob).toLocaleDateString('en-IN') : null} />
            <Row label="Gender" value={student.gender} />
            <Row label="Address" value={student.address} />
          </Section>

          <Section title="👨‍👩‍👦 Parent Info">
            <Row label="Parent Name" value={student.parentName} />
            <Row label="Parent Phone" value={student.parentPhone} />
            <Row label="Parent Email" value={student.parentEmail} />
          </Section>

          <Section title="👨‍🏫 Class Advisor">
            <Row label="Name" value={student.classAdvisor?.name} />
            <Row label="Email" value={student.classAdvisor?.email} />
            <Row label="Phone" value={student.classAdvisor?.phone} />
            <Row label="Cabin" value={student.classAdvisor?.cabin} />
          </Section>

          <Section title="💰 Fee Summary">
            <Row label="Total Fee" value={student.fees?.totalFee ? `₹${student.fees.totalFee.toLocaleString()}` : null} />
            <Row label="Paid" value={student.fees?.paidAmount ? `₹${student.fees.paidAmount.toLocaleString()}` : null} />
            <Row label="Pending" value={student.fees?.pendingAmount ? `₹${student.fees.pendingAmount.toLocaleString()}` : null} />
            <Row label="Scholarship" value={student.fees?.scholarshipName ? `${student.fees.scholarshipName} (₹${student.fees.scholarshipAmount?.toLocaleString()})` : 'None'} />
          </Section>
        </div>

        {/* Current semester */}
        {latestSem && (
          <div className="view-section fade-up">
            <h3>📚 Current Semester (Sem {latestSem.semNumber})</h3>
            <div className="sem-summary">
              <div className="sem-meta-row">
                <span>SGPA: <strong>{latestSem.sgpa}</strong></span>
                <span>Attendance: <strong className={latestSem.attendancePercentage < 75 ? 'danger-text' : 'ok-text'}>{latestSem.attendancePercentage}%</strong></span>
                <span>Year: <strong>{latestSem.year}</strong></span>
              </div>
              <table className="view-subject-table">
                <thead><tr><th>Code</th><th>Subject</th><th>Credits</th><th>Marks</th><th>Grade</th><th>Attendance</th><th>Status</th></tr></thead>
                <tbody>
                  {latestSem.subjects?.map((sub, i) => (
                    <tr key={i}>
                      <td><code>{sub.code}</code></td>
                      <td>{sub.name}</td>
                      <td>{sub.credits}</td>
                      <td>{sub.marks}/{sub.maxMarks}</td>
                      <td><span className={`grade-badge grade-${sub.grade?.replace('+','p')}`}>{sub.grade}</span></td>
                      <td><span className={sub.attendance < 75 ? 'danger-text' : 'ok-text'}>{sub.attendance}%</span></td>
                      <td><span className={`badge ${sub.status==='backlog'?'badge-red':sub.status==='ongoing'?'badge-yellow':sub.status==='repeated'?'badge-blue':'badge-green'}`}>{sub.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* All semesters summary */}
        {student.semesters?.length > 0 && (
          <div className="view-section fade-up">
            <h3>📊 Semester-wise Performance</h3>
            <div className="sem-grid">
              {student.semesters.map((sem, i) => (
                <div key={i} className="sem-card">
                  <div className="sem-card-title">Sem {sem.semNumber}</div>
                  <div className="sem-card-sgpa">{sem.sgpa}</div>
                  <div className="sem-card-lbl">SGPA</div>
                  <div className={`sem-card-att ${sem.attendancePercentage < 75 ? 'low' : ''}`}>{sem.attendancePercentage}%</div>
                  <div className="sem-card-lbl">Attendance</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
