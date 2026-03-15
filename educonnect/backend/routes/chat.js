const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const Student = require('../models/Student');

const intents = [
  { pattern: /attendance|present|absent|bunk/i, intent: 'attendance' },
  { pattern: /cgpa|gpa|grade point|overall performance/i, intent: 'cgpa' },
  { pattern: /marks?|score|subject.*mark|performance/i, intent: 'marks' },
  { pattern: /backlog|arrear|fail|repeat/i, intent: 'backlogs' },
  { pattern: /fee|payment|paid|pending|due|scholarship/i, intent: 'fees' },
  { pattern: /exam|test|schedule|timetable/i, intent: 'exams' },
  { pattern: /assignment|homework|deadline|submit/i, intent: 'assignments' },
  { pattern: /announce|news|notice|update/i, intent: 'announcements' },
  { pattern: /advisor|faculty|contact|teacher|professor/i, intent: 'contact' },
  { pattern: /strong|best|good subject|excel/i, intent: 'strong_subjects' },
  { pattern: /weak|poor|improve|struggle/i, intent: 'weak_subjects' },
  { pattern: /profile|info|detail|student/i, intent: 'profile' },
  { pattern: /help|what can|menu|option/i, intent: 'help' },
  { pattern: /hello|hi |hey|morning|evening/i, intent: 'greeting' },
  { pattern: /bye|logout|exit|goodbye/i, intent: 'goodbye' }
];

function detectIntent(msg) {
  for (const item of intents) { if (item.pattern.test(msg)) return item.intent; }
  return 'unknown';
}

function fmt(date) { return new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }); }

function buildResponse(intent, student) {
  const latest = student.semesters[student.semesters.length - 1];
  switch (intent) {
    case 'greeting': return { type: 'greeting', message: `Hello! 👋 Welcome to **EduConnect Parent Portal**.\n\nTracking academics for **${student.name}** (${student.registrationNumber}).\n\nAsk me about attendance, marks, fees, exams, backlogs and more!` };
    case 'help': return { type: 'menu', message: `Here's what I can help you with:`, options: ['📊 Attendance','🎓 CGPA','📝 Marks','⚠️ Backlogs','💰 Fees','📅 Exams','📋 Assignments','📢 Announcements','👨‍🏫 Contacts','💪 Strong Subjects','📈 Weak Subjects','👤 Profile'] };
    case 'profile': return { type: 'profile', message: 'Student Profile', data: { Name: student.name, 'Reg No': student.registrationNumber, Branch: student.branch, Year: `${student.year} Year`, Section: student.section, CGPA: student.cgpa, 'Parent': student.parentName } };
    case 'attendance': {
      const avg = student.semesters.reduce((s, sem) => s + (sem.attendancePercentage || 0), 0) / (student.semesters.length || 1);
      const low = latest?.subjects.filter(s => s.attendance < 75) || [];
      let msg = `📊 **Attendance - ${student.name}**\n\n🎯 Overall Average: **${Math.round(avg)}%**\n📅 Current Sem ${latest?.semNumber}: **${latest?.attendancePercentage}%**\n\n**Semester-wise:**\n`;
      student.semesters.forEach(s => { msg += `${s.attendancePercentage >= 75 ? '✅' : '⚠️'} Sem ${s.semNumber}: ${s.attendancePercentage}%\n`; });
      if (low.length) { msg += `\n⚠️ **Low Attendance Alert:**\n`; low.forEach(s => { msg += `• ${s.name}: ${s.attendance}% (Below 75%)\n`; }); }
      return { type: 'attendance', message: msg };
    }
    case 'cgpa': return { type: 'cgpa', message: `🎓 **Academic Performance**\n\n🏆 Current CGPA: **${student.cgpa}**\n\n**Semester SGPA:**\n${student.semesters.map(s => `📘 Sem ${s.semNumber}: ${s.sgpa}`).join('\n')}\n\n${student.cgpa >= 8.5 ? '🌟 Excellent!' : student.cgpa >= 7 ? '👍 Good performance!' : '📈 Room for improvement.'}` };
    case 'marks': { let msg = `📝 **Subject Marks - Sem ${latest?.semNumber}**\n\n`; latest?.subjects.forEach(s => { const p = Math.round((s.marks/s.maxMarks)*100); msg += `${p>=75?'✅':p>=50?'⚡':'❌'} **${s.name}**\n   ${s.marks}/${s.maxMarks} (${p}%) | Grade: ${s.grade}\n\n`; }); return { type: 'marks', message: msg }; }
    case 'backlogs': { const bl = student.semesters.flatMap(sem => sem.subjects.filter(s => s.status==='backlog'||s.status==='repeated').map(s => `• ${s.name} (Sem ${sem.semNumber}) - ${s.status==='repeated'?'Cleared on repeat':'Pending'}`)); return { type: 'backlogs', message: `⚠️ **Backlog Status**\n\nTotal: **${student.totalBacklogs}**\n\n${bl.length?bl.join('\n'):'✅ No active backlogs!'}` }; }
    case 'fees': return { type: 'fees', message: `💰 **Fee Status**\n\n💵 Total: ₹${student.fees.totalFee?.toLocaleString()}\n✅ Paid: ₹${student.fees.paidAmount?.toLocaleString()}\n⏳ Pending: ₹${student.fees.pendingAmount?.toLocaleString()}\n${student.fees.scholarshipAmount>0?`🎓 Scholarship: ₹${student.fees.scholarshipAmount?.toLocaleString()} (${student.fees.scholarshipName})\n`:''}\n**Recent Payments:**\n${student.fees.payments?.slice(-3).map(p=>`${p.status==='paid'?'✅':'⚠️'} ${fmt(p.date)} - ₹${p.amount?.toLocaleString()} (${p.description})`).join('\n')}` };
    case 'exams': return { type: 'exams', message: `📅 **Upcoming Exams**\n\n${student.upcomingExams?.length===0?'No upcoming exams.':student.upcomingExams?.map(e=>`📋 **${e.subject}**\n   📅 ${fmt(e.date)} | 🕐 ${e.time}\n   📍 ${e.venue} | ${e.type}`).join('\n\n')}` };
    case 'assignments': return { type: 'assignments', message: `📋 **Assignments**\n\n${student.assignments?.map(a=>`${a.status==='submitted'?'✅':a.status==='pending'?'⏳':'❌'} **${a.subject}**\n   ${a.title}\n   Due: ${fmt(a.deadline)} | ${a.status.toUpperCase()}`).join('\n\n')}` };
    case 'announcements': return { type: 'announcements', message: `📢 **Announcements**\n\n${student.announcements?.map(a=>`${a.priority==='high'?'🔴':a.priority==='medium'?'🟡':'🟢'} **${a.title}**\n   ${a.message}\n   📅 ${fmt(a.date)}`).join('\n\n')}` };
    case 'contact': return { type: 'contact', message: `👨‍🏫 **Faculty Contacts**\n\n**Class Advisor:** ${student.classAdvisor?.name}\n📧 ${student.classAdvisor?.email}\n📞 ${student.classAdvisor?.phone}\n🏫 ${student.classAdvisor?.cabin}\n\n**Academic Office:** academicoffice@college.edu\n**Exam Cell:** examcell@college.edu` };
    case 'strong_subjects': { const all = student.semesters.flatMap(s=>s.subjects); const top = all.filter(s=>s.marks>=80).sort((a,b)=>b.marks-a.marks).slice(0,5); return { type: 'insights', message: `💪 **Strong Subjects**\n\n${top.map(s=>`⭐ **${s.name}** - ${s.marks}/${s.maxMarks} | Grade: ${s.grade}`).join('\n')}\n\n✨ Keep it up!` }; }
    case 'weak_subjects': { const all = student.semesters.flatMap(s=>s.subjects); const weak = all.filter(s=>s.marks<70).sort((a,b)=>a.marks-b.marks).slice(0,5); return { type: 'insights', message: `📈 **Areas to Improve**\n\n${weak.length===0?'🌟 No weak subjects!':weak.map(s=>`⚠️ **${s.name}** - ${s.marks}/${s.maxMarks} | Grade: ${s.grade}`).join('\n')}\n\n💡 Suggestions:\n• Regular revision\n• Seek faculty help\n• Solve previous papers` }; }
    case 'goodbye': return { type: 'goodbye', message: `Thank you for using EduConnect! 🙏\n\nSession ending securely. Have a great day!` };
    default: return { type: 'unknown', message: `I didn't understand that. 🤔\n\nTry asking about:\n• Attendance | CGPA | Marks | Fees\n• Exams | Assignments | Backlogs\n\nType **help** to see all options.` };
  }
}

router.post('/message', authMiddleware, async (req, res) => {
  try {
    const { message } = req.body;
    if (!message?.trim()) return res.status(400).json({ success: false, message: 'Message required.' });
    const student = await Student.findById(req.user.studentId);
    if (!student) return res.status(404).json({ success: false, message: 'Student not found.' });
    const intent = detectIntent(message);
    res.json({ success: true, intent, response: buildResponse(intent, student), timestamp: new Date() });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
