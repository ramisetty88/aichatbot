import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendChatMessage } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import './ParentChat.css';

function parseMarkdown(text) {
  if (!text) return '';
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br/>');
}

const QUICK = [
  { label: '📊 Attendance', text: 'Show attendance details' },
  { label: '🎓 CGPA', text: 'What is the current CGPA?' },
  { label: '📝 Marks', text: 'Show subject-wise marks' },
  { label: '⚠️ Backlogs', text: 'Are there any backlogs?' },
  { label: '💰 Fees', text: 'Show fee payment status' },
  { label: '📅 Exams', text: 'Upcoming exam schedule' },
  { label: '📋 Assignments', text: 'Show assignment deadlines' },
  { label: '📢 Notices', text: 'Latest announcements' },
  { label: '👨‍🏫 Contacts', text: 'Faculty contact details' },
  { label: '💪 Strengths', text: 'Show strong subjects' },
  { label: '📈 Improve', text: 'Subjects needing improvement' },
  { label: '👤 Profile', text: 'Show student profile' },
];

function BotBubble({ msg }) {
  const { response, intent } = msg;
  const colors = {
    attendance:'#00c9a7', cgpa:'#f5a623', marks:'#a29bfe',
    backlogs:'#ff4757', fees:'#2ed573', exams:'#ffa502',
    assignments:'#ff6b81', announcements:'#eccc68', contact:'#74b9ff',
    strong_subjects:'#00b894', weak_subjects:'#fd79a8',
    greeting:'#00c9a7', help:'#74b9ff', goodbye:'#b2bec3',
    profile:'#74b9ff', unknown:'#636e72', error:'#ff4757',
  };
  const c = colors[intent] || 'var(--accent)';
  return (
    <div className="bubble-row bot-row">
      <div className="bot-av" style={{ borderColor: c }}>🤖</div>
      <div className="bot-bubble" style={{ borderLeftColor: c }}>
        {response?.type === 'menu' && response?.options ? (
          <>
            <div className="bubble-text" dangerouslySetInnerHTML={{ __html: parseMarkdown(response.message) }} />
            <div className="menu-chips">{response.options.map((o,i) => <span key={i} className="menu-chip">{o}</span>)}</div>
          </>
        ) : response?.type === 'profile' && response?.data ? (
          <>
            <div className="bubble-text"><strong>🎓 Student Profile</strong></div>
            <div className="profile-rows">
              {Object.entries(response.data).map(([k,v]) => (
                <div key={k} className="prow"><span className="pk">{k}</span><span className="pv">{v}</span></div>
              ))}
            </div>
          </>
        ) : (
          <div className="bubble-text" dangerouslySetInnerHTML={{ __html: parseMarkdown(response?.message || '') }} />
        )}
        <div className="bubble-ts">{new Date(msg.timestamp).toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit' })}</div>
      </div>
    </div>
  );
}

function UserBubble({ msg }) {
  return (
    <div className="bubble-row user-row">
      <div className="user-bubble">
        <span>{msg.text}</span>
        <div className="bubble-ts user-ts">{new Date(msg.timestamp).toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit' })}</div>
      </div>
      <div className="user-av">👤</div>
    </div>
  );
}

export default function ParentChat() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sideOpen, setSideOpen] = useState(false);
  const endRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    setMessages([{
      id: 'w', role: 'bot', intent: 'greeting',
      response: { type: 'greeting', message: `Hello ${user?.parentName || 'Parent'}! 👋\n\nWelcome to **EduConnect Parent Portal**.\n\nI'm tracking academics for **${user?.name}** (${user?.registrationNumber}).\n\nAsk me about attendance, marks, fees, exams, backlogs, and more!` },
      timestamp: new Date()
    }]);
  }, [user]);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const send = async (text) => {
    const userMsg = { id: Date.now(), role: 'user', text, timestamp: new Date() };
    setMessages(p => [...p, userMsg]);
    setInput(''); setLoading(true);
    try {
      const res = await sendChatMessage(text);
      setMessages(p => [...p, { id: Date.now()+1, role: 'bot', intent: res.data.intent, response: res.data.response, timestamp: new Date(res.data.timestamp) }]);
      if (res.data.intent === 'goodbye') setTimeout(() => { logout(); navigate('/'); }, 3000);
    } catch {
      setMessages(p => [...p, { id: Date.now()+1, role: 'bot', intent: 'error', response: { type: 'error', message: 'Connection error. Please try again.' }, timestamp: new Date() }]);
    } finally { setLoading(false); inputRef.current?.focus(); }
  };

  const handleLogout = () => { if (window.confirm('End this session?')) { logout(); navigate('/'); } };

  return (
    <div className="parent-chat">
      {/* Sidebar */}
      <aside className={`chat-sidebar ${sideOpen ? 'open' : ''}`}>
        <div className="cs-top">
          <div className="cs-av">{user?.name?.charAt(0) || 'S'}</div>
          <div>
            <div className="cs-name">{user?.name}</div>
            <div className="cs-reg">{user?.registrationNumber}</div>
          </div>
        </div>
        <div className="cs-info">
          {[['Branch', user?.branch], ['Year', `${user?.year} Year`], ['Section', user?.section]].map(([l,v]) => (
            <div key={l} className="cs-row"><span>{l}</span><span>{v || '—'}</span></div>
          ))}
        </div>
        <div className="cs-label">Quick Actions</div>
        <div className="cs-actions">
          {QUICK.map(q => (
            <button key={q.label} className="cs-btn" onClick={() => { send(q.text); setSideOpen(false); }}>{q.label}</button>
          ))}
        </div>
        <button className="cs-logout" onClick={handleLogout}>🔒 Secure Logout</button>
      </aside>

      {/* Main */}
      <div className="chat-main">
        <header className="chat-hdr">
          <button className="ham-btn" onClick={() => setSideOpen(!sideOpen)}>
            <span></span><span></span><span></span>
          </button>
          <div className="hdr-brand">
            <div className="hdr-logo">EC</div>
            <div>
              <div className="hdr-title">EduConnect</div>
              <div className="hdr-status"><span className="dot"></span>Online</div>
            </div>
          </div>
          <div className="hdr-right">
            <span className="hdr-student">{user?.name}</span>
            <button className="hdr-logout" onClick={handleLogout}>⏻ Logout</button>
          </div>
        </header>

        <div className="messages-area">
          {messages.map(msg => msg.role === 'user'
            ? <UserBubble key={msg.id} msg={msg} />
            : <BotBubble key={msg.id} msg={msg} />
          )}
          {loading && (
            <div className="typing-row">
              <div className="typing-av">🤖</div>
              <div className="typing-pill">
                <span></span><span></span><span></span>
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        <div className="quick-bar">
          {QUICK.map(q => (
            <button key={q.label} className="quick-chip" onClick={() => send(q.text)} disabled={loading}>{q.label}</button>
          ))}
        </div>

        <form className="chat-input-row" onSubmit={e => { e.preventDefault(); if (input.trim() && !loading) send(input.trim()); }}>
          <div className="input-wrap-chat">
            <input ref={inputRef} type="text" placeholder="Ask about attendance, marks, fees, exams..."
              value={input} onChange={e => setInput(e.target.value)} disabled={loading} />
            <button type="submit" disabled={!input.trim() || loading} className="send-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </button>
          </div>
        </form>
      </div>

      {sideOpen && <div className="sidebar-mask" onClick={() => setSideOpen(false)}></div>}
    </div>
  );
}
