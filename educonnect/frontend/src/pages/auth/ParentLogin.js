import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { parentVerify, parentVerifyOTP } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import './AuthPages.css';

export default function ParentLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ registrationNumber: '', parentPhone: '' });
  const [otp, setOtp] = useState('');
  const [studentName, setStudentName] = useState('');
  const [otpMsg, setOtpMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleVerify = async e => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      const res = await parentVerify(form);
      setStudentName(res.data.studentName);
      setOtpMsg(res.data.message);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed.');
    } finally { setLoading(false); }
  };

  const handleOTP = async e => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      const res = await parentVerifyOTP({ registrationNumber: form.registrationNumber, otp });
      login(res.data.token, res.data.student, 'parent');
      navigate('/parent/chat');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP.');
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg">
        <div className="orb green-orb"></div>
        <div className="grid"></div>
      </div>
      <div className="auth-container fade-up">
        <button className="back-btn" onClick={() => step === 2 ? setStep(1) : navigate('/')}>← Back</button>

        <div className="step-bar">
          <div className={`step-item ${step >= 1 ? 'active' : ''}`}><span>1</span> Verify</div>
          <div className="step-line"></div>
          <div className={`step-item ${step >= 2 ? 'active' : ''}`}><span>2</span> OTP</div>
        </div>

        <div className="auth-header">
          <div className="auth-icon parent-auth-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
            </svg>
          </div>
          <div>
            <h1>{step === 1 ? 'Parent Login' : 'Enter OTP'}</h1>
            <p>{step === 1 ? 'Verify your identity to access student portal' : `Verifying for ${studentName}`}</p>
          </div>
        </div>

        {step === 1 ? (
          <form onSubmit={handleVerify} className="auth-form">
            <div className="field">
              <label>Student Registration Number</label>
              <div className="input-wrap">
                <span className="icon">🎓</span>
                <input type="text" placeholder="e.g. CS2021001" value={form.registrationNumber}
                  onChange={e => setForm({ ...form, registrationNumber: e.target.value.toUpperCase() })} required />
              </div>
            </div>
            <div className="field">
              <label>Registered Parent Phone</label>
              <div className="input-wrap">
                <span className="icon">📱</span>
                <input type="tel" placeholder="10-digit mobile number" maxLength={10} value={form.parentPhone}
                  onChange={e => setForm({ ...form, parentPhone: e.target.value })} required />
              </div>
            </div>
            {error && <div className="error-box">⚠️ {error}</div>}
            <button type="submit" className="submit-btn parent-btn" disabled={loading}>
              {loading ? <span className="spinner"></span> : '📲 Send OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleOTP} className="auth-form">
            <div className="otp-hint-box">{otpMsg}</div>
            <div className="field">
              <label>One-Time Password</label>
              <div className="input-wrap">
                <span className="icon">🔐</span>
                <input type="text" placeholder="Enter 6-digit OTP" maxLength={6} value={otp}
                  onChange={e => setOtp(e.target.value)} required className="otp-field" />
              </div>
            </div>
            {error && <div className="error-box">⚠️ {error}</div>}
            <button type="submit" className="submit-btn parent-btn" disabled={loading}>
              {loading ? <span className="spinner"></span> : '✅ Verify & Login'}
            </button>
          </form>
        )}

        <div className="demo-box parent-demo">
          <strong>Demo Credentials</strong><br />
          Reg: CS2021001 | Phone: 9876543210<br />
          Reg: EC2022015 | Phone: 8765432109
        </div>
      </div>
    </div>
  );
}
