import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createStudent, getStudent, updateStudent } from '../../utils/api';
import AdminLayout from '../../components/admin/AdminLayout';
import './StudentForm.css';

const BRANCHES = ['Computer Science & Engineering','Electronics & Communication Engineering','Mechanical Engineering','Civil Engineering','Electrical Engineering','Information Technology'];
const GRADES = ['O','A+','A','B+','B','C','F'];

const emptySubject = () => ({ code: '', name: '', credits: 3, grade: 'B', marks: 0, maxMarks: 100, attendance: 75, status: 'completed' });
const emptySem = () => ({ semNumber: 1, year: new Date().getFullYear(), sgpa: 0, attendancePercentage: 75, subjects: [emptySubject()] });

const defaultForm = {
  registrationNumber: '', name: '', email: '', dob: '', gender: 'Male',
  branch: 'Computer Science & Engineering', year: 1, section: 'A',
  parentName: '', parentPhone: '', parentEmail: '', address: '',
  totalBacklogs: 0,
  classAdvisor: { name: '', email: '', phone: '', cabin: '' },
  semesters: [],
  fees: { totalFee: 0, paidAmount: 0, pendingAmount: 0, scholarshipAmount: 0, scholarshipName: '' },
};

export default function StudentForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('basic');

  useEffect(() => {
    if (!isEdit) return;
    getStudent(id).then(r => {
      const d = r.data.data;
      setForm({
        ...defaultForm, ...d,
        dob: d.dob ? d.dob.split('T')[0] : '',
        fees: { ...defaultForm.fees, ...d.fees },
        classAdvisor: { ...defaultForm.classAdvisor, ...d.classAdvisor },
        semesters: d.semesters || [],
      });
    }).catch(() => alert('Failed to load student.')).finally(() => setFetching(false));
  }, [id, isEdit]);

  const set = (path, val) => {
    setForm(prev => {
      const clone = JSON.parse(JSON.stringify(prev));
      const keys = path.split('.');
      let cur = clone;
      keys.slice(0, -1).forEach(k => { if (!cur[k]) cur[k] = {}; cur = cur[k]; });
      cur[keys[keys.length - 1]] = val;
      return clone;
    });
  };

  const addSem = () => setForm(p => ({ ...p, semesters: [...p.semesters, { ...emptySem(), semNumber: p.semesters.length + 1 }] }));
  const removeSem = i => setForm(p => ({ ...p, semesters: p.semesters.filter((_, idx) => idx !== i) }));
  const addSubject = si => setForm(p => { const s = JSON.parse(JSON.stringify(p)); s.semesters[si].subjects.push(emptySubject()); return s; });
  const removeSubject = (si, sji) => setForm(p => { const s = JSON.parse(JSON.stringify(p)); s.semesters[si].subjects.splice(sji, 1); return s; });
  const setSemField = (si, key, val) => setForm(p => { const s = JSON.parse(JSON.stringify(p)); s.semesters[si][key] = val; return s; });
  const setSubField = (si, sji, key, val) => setForm(p => { const s = JSON.parse(JSON.stringify(p)); s.semesters[si].subjects[sji][key] = val; return s; });

  const handleSubmit = async e => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      if (isEdit) await updateStudent(id, form);
      else await createStudent(form);
      navigate('/admin/students');
    } catch (err) {
      setError(err.response?.data?.message || 'Save failed. Please check all fields.');
    } finally { setLoading(false); }
  };

  if (fetching) return <AdminLayout><div className="form-loading"><span className="spinner"></span> Loading...</div></AdminLayout>;

  const tabs = [
    { id: 'basic', label: '👤 Basic Info' },
    { id: 'parent', label: '👨‍👩‍👦 Parent & Contact' },
    { id: 'advisor', label: '👨‍🏫 Class Advisor' },
    { id: 'semesters', label: '📚 Semesters' },
    { id: 'fees', label: '💰 Fees' },
  ];

  return (
    <AdminLayout>
      <div className="student-form-page">
        <div className="form-header fade-up">
          <button className="back-link" onClick={() => navigate('/admin/students')}>← Back to Students</button>
          <h2>{isEdit ? '✏️ Edit Student' : '➕ Add New Student'}</h2>
          <p>{isEdit ? `Editing record for ${form.name}` : 'Fill in the details to add a new student'}</p>
        </div>

        <div className="form-tabs fade-up">
          {tabs.map(t => (
            <button key={t.id} className={`tab-btn ${activeTab === t.id ? 'active' : ''}`} onClick={() => setActiveTab(t.id)}>
              {t.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="form-body fade-up">
          {/* BASIC INFO */}
          {activeTab === 'basic' && (
            <div className="form-section">
              <h3>Basic Information</h3>
              <div className="form-grid">
                <div className="field"><label>Registration Number *</label>
                  <input type="text" value={form.registrationNumber} onChange={e => set('registrationNumber', e.target.value.toUpperCase())} required disabled={isEdit} placeholder="e.g. CS2021001" /></div>
                <div className="field"><label>Full Name *</label>
                  <input type="text" value={form.name} onChange={e => set('name', e.target.value)} required placeholder="Student full name" /></div>
                <div className="field"><label>Email</label>
                  <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="student@college.edu" /></div>
                <div className="field"><label>Date of Birth</label>
                  <input type="date" value={form.dob} onChange={e => set('dob', e.target.value)} /></div>
                <div className="field"><label>Gender</label>
                  <select value={form.gender} onChange={e => set('gender', e.target.value)}>
                    <option>Male</option><option>Female</option><option>Other</option>
                  </select></div>
                <div className="field"><label>Branch *</label>
                  <select value={form.branch} onChange={e => set('branch', e.target.value)} required>
                    {BRANCHES.map(b => <option key={b}>{b}</option>)}
                  </select></div>
                <div className="field"><label>Year *</label>
                  <select value={form.year} onChange={e => set('year', parseInt(e.target.value))} required>
                    <option value={1}>1st Year</option><option value={2}>2nd Year</option>
                    <option value={3}>3rd Year</option><option value={4}>4th Year</option>
                  </select></div>
                <div className="field"><label>Section</label>
                  <input type="text" value={form.section} onChange={e => set('section', e.target.value)} placeholder="A" maxLength={2} /></div>
                <div className="field"><label>Total Backlogs</label>
                  <input type="number" min={0} value={form.totalBacklogs} onChange={e => set('totalBacklogs', parseInt(e.target.value)||0)} /></div>
                <div className="field full"><label>Address</label>
                  <textarea rows={2} value={form.address} onChange={e => set('address', e.target.value)} placeholder="Full address"></textarea></div>
              </div>
            </div>
          )}

          {/* PARENT */}
          {activeTab === 'parent' && (
            <div className="form-section">
              <h3>Parent & Contact Information</h3>
              <div className="form-grid">
                <div className="field"><label>Parent Name</label>
                  <input value={form.parentName} onChange={e => set('parentName', e.target.value)} placeholder="Father/Mother name" /></div>
                <div className="field"><label>Parent Phone *</label>
                  <input type="tel" value={form.parentPhone} onChange={e => set('parentPhone', e.target.value)} required maxLength={10} placeholder="10-digit mobile" /></div>
                <div className="field"><label>Parent Email</label>
                  <input type="email" value={form.parentEmail} onChange={e => set('parentEmail', e.target.value)} placeholder="parent@email.com" /></div>
              </div>
            </div>
          )}

          {/* ADVISOR */}
          {activeTab === 'advisor' && (
            <div className="form-section">
              <h3>Class Advisor Details</h3>
              <div className="form-grid">
                <div className="field"><label>Advisor Name</label>
                  <input value={form.classAdvisor.name} onChange={e => set('classAdvisor.name', e.target.value)} placeholder="Dr./Prof. Name" /></div>
                <div className="field"><label>Advisor Email</label>
                  <input type="email" value={form.classAdvisor.email} onChange={e => set('classAdvisor.email', e.target.value)} placeholder="advisor@college.edu" /></div>
                <div className="field"><label>Advisor Phone</label>
                  <input value={form.classAdvisor.phone} onChange={e => set('classAdvisor.phone', e.target.value)} placeholder="Phone number" /></div>
                <div className="field"><label>Cabin / Room</label>
                  <input value={form.classAdvisor.cabin} onChange={e => set('classAdvisor.cabin', e.target.value)} placeholder="Block, Room number" /></div>
              </div>
            </div>
          )}

          {/* SEMESTERS */}
          {activeTab === 'semesters' && (
            <div className="form-section">
              <div className="section-header">
                <h3>Semester Records</h3>
                <button type="button" className="btn-sm-add" onClick={addSem}>+ Add Semester</button>
              </div>
              {form.semesters.length === 0 && <div className="no-data">No semesters added yet. Click "+ Add Semester" to begin.</div>}
              {form.semesters.map((sem, si) => (
                <div key={si} className="sem-block">
                  <div className="sem-header">
                    <span className="sem-title">Semester {sem.semNumber}</span>
                    <div className="sem-meta-fields">
                      <div className="mini-field"><label>Sem No</label>
                        <input type="number" min={1} value={sem.semNumber} onChange={e => setSemField(si,'semNumber',parseInt(e.target.value)||1)} /></div>
                      <div className="mini-field"><label>Year</label>
                        <input type="number" min={2000} value={sem.year} onChange={e => setSemField(si,'year',parseInt(e.target.value)||2021)} /></div>
                      <div className="mini-field"><label>SGPA</label>
                        <input type="number" step="0.01" min={0} max={10} value={sem.sgpa} onChange={e => setSemField(si,'sgpa',parseFloat(e.target.value)||0)} /></div>
                      <div className="mini-field"><label>Attendance%</label>
                        <input type="number" min={0} max={100} value={sem.attendancePercentage} onChange={e => setSemField(si,'attendancePercentage',parseInt(e.target.value)||0)} /></div>
                    </div>
                    <button type="button" className="btn-rem-sem" onClick={() => removeSem(si)}>🗑️ Remove</button>
                  </div>

                  <table className="subject-table">
                    <thead><tr><th>Code</th><th>Subject Name</th><th>Credits</th><th>Grade</th><th>Marks</th><th>Attendance%</th><th>Status</th><th></th></tr></thead>
                    <tbody>
                      {sem.subjects.map((sub, sji) => (
                        <tr key={sji}>
                          <td><input value={sub.code} onChange={e => setSubField(si,sji,'code',e.target.value)} placeholder="MA101" /></td>
                          <td><input value={sub.name} onChange={e => setSubField(si,sji,'name',e.target.value)} placeholder="Subject name" /></td>
                          <td><input type="number" min={1} max={6} value={sub.credits} onChange={e => setSubField(si,sji,'credits',parseInt(e.target.value)||1)} /></td>
                          <td><select value={sub.grade} onChange={e => setSubField(si,sji,'grade',e.target.value)}>{GRADES.map(g=><option key={g}>{g}</option>)}</select></td>
                          <td><input type="number" min={0} max={100} value={sub.marks} onChange={e => setSubField(si,sji,'marks',parseInt(e.target.value)||0)} /></td>
                          <td><input type="number" min={0} max={100} value={sub.attendance} onChange={e => setSubField(si,sji,'attendance',parseInt(e.target.value)||0)} /></td>
                          <td><select value={sub.status} onChange={e => setSubField(si,sji,'status',e.target.value)}>
                            <option value="completed">Completed</option><option value="ongoing">Ongoing</option>
                            <option value="backlog">Backlog</option><option value="repeated">Repeated</option>
                          </select></td>
                          <td><button type="button" className="btn-rem-sub" onClick={() => removeSubject(si,sji)}>✕</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <button type="button" className="btn-add-sub" onClick={() => addSubject(si)}>+ Add Subject</button>
                </div>
              ))}
            </div>
          )}

          {/* FEES */}
          {activeTab === 'fees' && (
            <div className="form-section">
              <h3>Fee Information</h3>
              <div className="form-grid">
                <div className="field"><label>Total Fee (₹)</label>
                  <input type="number" min={0} value={form.fees.totalFee} onChange={e => set('fees.totalFee',parseInt(e.target.value)||0)} /></div>
                <div className="field"><label>Paid Amount (₹)</label>
                  <input type="number" min={0} value={form.fees.paidAmount} onChange={e => { const v=parseInt(e.target.value)||0; set('fees.paidAmount',v); set('fees.pendingAmount',Math.max(0,form.fees.totalFee-v)); }} /></div>
                <div className="field"><label>Pending Amount (₹)</label>
                  <input type="number" min={0} value={form.fees.pendingAmount} readOnly /></div>
                <div className="field"><label>Scholarship Amount (₹)</label>
                  <input type="number" min={0} value={form.fees.scholarshipAmount} onChange={e => set('fees.scholarshipAmount',parseInt(e.target.value)||0)} /></div>
                <div className="field"><label>Scholarship Name</label>
                  <input value={form.fees.scholarshipName||''} onChange={e => set('fees.scholarshipName',e.target.value)} placeholder="e.g. Merit Scholarship" /></div>
              </div>
            </div>
          )}

          {error && <div className="form-error">⚠️ {error}</div>}

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={() => navigate('/admin/students')}>Cancel</button>
            <button type="submit" className="btn-save" disabled={loading}>
              {loading ? <><span className="spinner"></span> Saving...</> : (isEdit ? '✅ Update Student' : '✅ Add Student')}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
