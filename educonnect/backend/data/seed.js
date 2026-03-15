const Admin = require('../models/Admin');
const Student = require('../models/Student');

const students = [
  {
    registrationNumber: 'CS2021001',
    name: 'Arjun Sharma',
    email: 'arjun.sharma@college.edu',
    dob: new Date('2002-05-14'),
    gender: 'Male',
    branch: 'Computer Science & Engineering',
    year: 3,
    section: 'A',
    parentName: 'Ramesh Sharma',
    parentPhone: '9876543210',
    parentEmail: 'ramesh.sharma@gmail.com',
    address: '12-34, MG Road, Hyderabad, Telangana',
    cgpa: 8.4,
    totalBacklogs: 0,
    classAdvisor: { name: 'Dr. Priya Menon', email: 'priya.menon@college.edu', phone: '9845001122', cabin: 'CSE Block, Room 204' },
    semesters: [
      { semNumber: 1, year: 2021, sgpa: 8.2, attendancePercentage: 88, subjects: [
        { code: 'MA101', name: 'Engineering Mathematics I', credits: 4, grade: 'A', marks: 85, attendance: 90, status: 'completed' },
        { code: 'PH101', name: 'Engineering Physics', credits: 3, grade: 'B+', marks: 78, attendance: 85, status: 'completed' },
        { code: 'CS101', name: 'Programming in C', credits: 4, grade: 'A+', marks: 95, attendance: 92, status: 'completed' },
        { code: 'EG101', name: 'Engineering Graphics', credits: 2, grade: 'B', marks: 72, attendance: 88, status: 'completed' }
      ]},
      { semNumber: 2, year: 2022, sgpa: 8.5, attendancePercentage: 91, subjects: [
        { code: 'MA102', name: 'Engineering Mathematics II', credits: 4, grade: 'A', marks: 87, attendance: 93, status: 'completed' },
        { code: 'CS102', name: 'Data Structures', credits: 4, grade: 'A+', marks: 92, attendance: 94, status: 'completed' },
        { code: 'CS103', name: 'Digital Logic Design', credits: 3, grade: 'A', marks: 84, attendance: 90, status: 'completed' }
      ]},
      { semNumber: 3, year: 2022, sgpa: 8.6, attendancePercentage: 89, subjects: [
        { code: 'CS201', name: 'Algorithms', credits: 4, grade: 'A+', marks: 93, attendance: 91, status: 'completed' },
        { code: 'CS202', name: 'Operating Systems', credits: 4, grade: 'A', marks: 86, attendance: 89, status: 'completed' },
        { code: 'CS203', name: 'Database Management', credits: 4, grade: 'A', marks: 88, attendance: 90, status: 'completed' }
      ]},
      { semNumber: 4, year: 2023, sgpa: 8.3, attendancePercentage: 86, subjects: [
        { code: 'CS301', name: 'Software Engineering', credits: 4, grade: 'A', marks: 84, attendance: 88, status: 'completed' },
        { code: 'CS302', name: 'Web Technologies', credits: 3, grade: 'A+', marks: 94, attendance: 92, status: 'completed' },
        { code: 'CS303', name: 'Theory of Computation', credits: 3, grade: 'B', marks: 71, attendance: 80, status: 'completed' }
      ]},
      { semNumber: 5, year: 2023, sgpa: 8.6, attendancePercentage: 84, subjects: [
        { code: 'CS401', name: 'Cloud Computing', credits: 4, grade: 'A', marks: 85, attendance: 85, status: 'ongoing' },
        { code: 'CS402', name: 'Artificial Intelligence', credits: 4, grade: 'A+', marks: 91, attendance: 88, status: 'ongoing' },
        { code: 'CS403', name: 'Cyber Security', credits: 3, grade: 'B+', marks: 78, attendance: 82, status: 'ongoing' }
      ]}
    ],
    fees: {
      totalFee: 150000, paidAmount: 120000, pendingAmount: 30000,
      scholarshipAmount: 20000, scholarshipName: 'Merit Scholarship',
      payments: [
        { date: new Date('2023-07-10'), amount: 60000, description: 'Semester 5 Tuition Fee', status: 'paid' },
        { date: new Date('2023-01-15'), amount: 60000, description: 'Semester 4 Tuition Fee', status: 'paid' },
        { date: new Date('2024-01-01'), amount: 30000, description: 'Semester 6 Tuition Fee', status: 'pending' }
      ]
    },
    upcomingExams: [
      { subject: 'Cloud Computing', date: new Date('2024-04-10'), time: '10:00 AM', venue: 'Hall A - Block 2', type: 'Mid Semester' },
      { subject: 'Artificial Intelligence', date: new Date('2024-04-12'), time: '02:00 PM', venue: 'Hall B - Block 2', type: 'Mid Semester' }
    ],
    assignments: [
      { subject: 'Cloud Computing', title: 'AWS Architecture Design', deadline: new Date('2024-03-25'), status: 'submitted' },
      { subject: 'Artificial Intelligence', title: 'Neural Network Implementation', deadline: new Date('2024-03-28'), status: 'pending' }
    ],
    announcements: [
      { title: 'Semester Exam Schedule Released', message: 'End semester exams begin May 5, 2024.', date: new Date('2024-03-01'), priority: 'high' },
      { title: 'Industrial Visit - TCS Hyderabad', message: 'Scheduled for March 30, 2024.', date: new Date('2024-03-10'), priority: 'medium' }
    ]
  },
  {
    registrationNumber: 'EC2022015',
    name: 'Priya Reddy',
    email: 'priya.reddy@college.edu',
    dob: new Date('2003-09-22'),
    gender: 'Female',
    branch: 'Electronics & Communication Engineering',
    year: 2,
    section: 'B',
    parentName: 'Suresh Reddy',
    parentPhone: '8765432109',
    parentEmail: 'suresh.reddy@gmail.com',
    address: '45 Gandhi Nagar, Vijayawada, AP',
    cgpa: 7.1,
    totalBacklogs: 1,
    classAdvisor: { name: 'Prof. Kumar Naidu', email: 'kumar.naidu@college.edu', phone: '9845003344', cabin: 'ECE Block, Room 112' },
    semesters: [
      { semNumber: 1, year: 2022, sgpa: 7.3, attendancePercentage: 75, subjects: [
        { code: 'MA101', name: 'Engineering Mathematics I', credits: 4, grade: 'B', marks: 70, attendance: 76, status: 'completed' },
        { code: 'PH101', name: 'Engineering Physics', credits: 3, grade: 'C', marks: 58, attendance: 72, status: 'completed' },
        { code: 'EC101', name: 'Basic Electronics', credits: 4, grade: 'B+', marks: 75, attendance: 78, status: 'completed' }
      ]},
      { semNumber: 2, year: 2022, sgpa: 6.9, attendancePercentage: 72, subjects: [
        { code: 'MA102', name: 'Engineering Mathematics II', credits: 4, grade: 'C+', marks: 62, attendance: 70, status: 'completed' },
        { code: 'EC102', name: 'Circuit Theory', credits: 4, grade: 'B', marks: 72, attendance: 75, status: 'completed' },
        { code: 'EC103', name: 'Signals & Systems', credits: 3, grade: 'F', marks: 38, attendance: 65, status: 'backlog' }
      ]},
      { semNumber: 3, year: 2023, sgpa: 7.2, attendancePercentage: 78, subjects: [
        { code: 'EC201', name: 'Digital Electronics', credits: 4, grade: 'B+', marks: 77, attendance: 80, status: 'ongoing' },
        { code: 'EC202', name: 'Analog Communication', credits: 4, grade: 'B', marks: 71, attendance: 78, status: 'ongoing' },
        { code: 'EC103', name: 'Signals & Systems (Repeat)', credits: 3, grade: 'C+', marks: 63, attendance: 77, status: 'repeated' }
      ]}
    ],
    fees: {
      totalFee: 120000, paidAmount: 80000, pendingAmount: 40000,
      scholarshipAmount: 0,
      payments: [
        { date: new Date('2022-07-15'), amount: 40000, description: 'Semester 1 Fee', status: 'paid' },
        { date: new Date('2023-01-20'), amount: 40000, description: 'Semester 2 Fee', status: 'paid' },
        { date: new Date('2023-07-01'), amount: 40000, description: 'Semester 3 Fee', status: 'pending' }
      ]
    },
    upcomingExams: [
      { subject: 'Digital Electronics', date: new Date('2024-04-08'), time: '10:00 AM', venue: 'Hall D - Block 1', type: 'Mid Semester' }
    ],
    assignments: [
      { subject: 'Digital Electronics', title: 'Logic Circuit Design', deadline: new Date('2024-03-26'), status: 'pending' }
    ],
    announcements: [
      { title: 'Attendance Warning', message: 'Students below 75% attendance will not be allowed in exams.', date: new Date('2024-03-05'), priority: 'high' }
    ]
  }
];

async function seedDB() {
  try {
    const adminCount = await Admin.countDocuments();
    if (adminCount === 0) {
      await Admin.create({ name: 'Super Admin', email: 'admin@college.edu', password: 'admin123', department: 'Administration' });
      console.log('✅ Admin seeded: admin@college.edu / admin123');
    }
    const studentCount = await Student.countDocuments();
    if (studentCount === 0) {
      await Student.insertMany(students);
      console.log('✅ Sample students seeded');
      console.log('   📋 Parent login: CS2021001 / 9876543210');
      console.log('   📋 Parent login: EC2022015 / 8765432109');
    }
  } catch (err) {
    console.error('❌ Seed error:', err.message);
  }
}

module.exports = seedDB;
