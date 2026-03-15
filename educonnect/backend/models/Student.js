const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  code: String,
  name: String,
  credits: Number,
  grade: String,
  marks: Number,
  maxMarks: { type: Number, default: 100 },
  attendance: Number,
  status: { type: String, enum: ['completed', 'ongoing', 'backlog', 'repeated'], default: 'completed' }
});

const semesterSchema = new mongoose.Schema({
  semNumber: Number,
  year: Number,
  sgpa: Number,
  attendancePercentage: Number,
  subjects: [subjectSchema]
});

const paymentSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  amount: Number,
  description: String,
  status: { type: String, enum: ['paid', 'pending'], default: 'paid' }
});

const studentSchema = new mongoose.Schema({
  registrationNumber: { type: String, required: true, unique: true, uppercase: true, trim: true },
  name: { type: String, required: true, trim: true },
  email: { type: String, trim: true },
  dob: Date,
  gender: { type: String, enum: ['Male', 'Female', 'Other'] },
  branch: { type: String, required: true },
  year: { type: Number, required: true },
  section: String,
  parentName: String,
  parentPhone: { type: String, required: true },
  parentEmail: String,
  address: String,
  photo: String,
  cgpa: { type: Number, default: 0 },
  totalBacklogs: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  classAdvisor: {
    name: String,
    email: String,
    phone: String,
    cabin: String
  },
  semesters: [semesterSchema],
  fees: {
    totalFee: { type: Number, default: 0 },
    paidAmount: { type: Number, default: 0 },
    pendingAmount: { type: Number, default: 0 },
    scholarshipAmount: { type: Number, default: 0 },
    scholarshipName: String,
    payments: [paymentSchema]
  },
  upcomingExams: [{
    subject: String,
    date: Date,
    time: String,
    venue: String,
    type: String
  }],
  assignments: [{
    subject: String,
    title: String,
    deadline: Date,
    status: { type: String, enum: ['submitted', 'pending', 'overdue'], default: 'pending' }
  }],
  announcements: [{
    title: String,
    message: String,
    date: { type: Date, default: Date.now },
    priority: { type: String, enum: ['high', 'medium', 'low'], default: 'medium' }
  }]
}, { timestamps: true });

// Auto-calculate cgpa from semesters
studentSchema.methods.recalcCGPA = function () {
  if (this.semesters.length === 0) return;
  const total = this.semesters.reduce((s, sem) => s + (sem.sgpa || 0), 0);
  this.cgpa = parseFloat((total / this.semesters.length).toFixed(2));
};

module.exports = mongoose.model('Student', studentSchema);
