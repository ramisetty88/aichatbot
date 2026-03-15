const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const { authMiddleware, adminOnly } = require('../middleware/auth');

const protect = [authMiddleware, adminOnly];

// GET all students (with search, filter, pagination)
router.get('/', protect, async (req, res) => {
  try {
    const { search, branch, year, page = 1, limit = 10 } = req.query;
    const query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { registrationNumber: { $regex: search, $options: 'i' } },
        { parentPhone: { $regex: search, $options: 'i' } }
      ];
    }
    if (branch) query.branch = branch;
    if (year) query.year = parseInt(year);

    const total = await Student.countDocuments(query);
    const students = await Student.find(query)
      .select('registrationNumber name branch year section parentName parentPhone cgpa totalBacklogs isActive createdAt')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({ success: true, data: students, total, page: parseInt(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET single student
router.get('/:id', protect, async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ success: false, message: 'Student not found.' });
    res.json({ success: true, data: student });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST create student
router.post('/', protect, async (req, res) => {
  try {
    const exists = await Student.findOne({ registrationNumber: req.body.registrationNumber?.toUpperCase() });
    if (exists) return res.status(409).json({ success: false, message: 'Registration number already exists.' });

    const student = new Student(req.body);
    student.recalcCGPA();
    await student.save();
    res.status(201).json({ success: true, message: 'Student added successfully.', data: student });
  } catch (err) {
    if (err.name === 'ValidationError') return res.status(400).json({ success: false, message: err.message });
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT update student
router.put('/:id', protect, async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ success: false, message: 'Student not found.' });

    Object.assign(student, req.body);
    student.recalcCGPA();
    await student.save();
    res.json({ success: true, message: 'Student updated successfully.', data: student });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH toggle active status
router.patch('/:id/toggle', protect, async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ success: false, message: 'Student not found.' });
    student.isActive = !student.isActive;
    await student.save();
    res.json({ success: true, message: `Student ${student.isActive ? 'activated' : 'deactivated'}.`, isActive: student.isActive });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE student
router.delete('/:id', protect, async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ success: false, message: 'Student not found.' });
    res.json({ success: true, message: 'Student deleted successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET dashboard stats
router.get('/stats/overview', protect, async (req, res) => {
  try {
    const total = await Student.countDocuments();
    const active = await Student.countDocuments({ isActive: true });
    const withBacklogs = await Student.countDocuments({ totalBacklogs: { $gt: 0 } });
    const branches = await Student.aggregate([{ $group: { _id: '$branch', count: { $sum: 1 } } }]);
    const yearDist = await Student.aggregate([{ $group: { _id: '$year', count: { $sum: 1 } } }]);
    const avgCgpa = await Student.aggregate([{ $group: { _id: null, avg: { $avg: '$cgpa' } } }]);
    const lowAttendance = await Student.aggregate([
      { $unwind: '$semesters' },
      { $sort: { 'semesters.semNumber': -1 } },
      { $group: { _id: '$_id', name: { $first: '$name' }, regNo: { $first: '$registrationNumber' }, attendance: { $first: '$semesters.attendancePercentage' } } },
      { $match: { attendance: { $lt: 75 } } },
      { $count: 'count' }
    ]);

    res.json({
      success: true,
      data: {
        total, active, inactive: total - active,
        withBacklogs,
        avgCgpa: parseFloat((avgCgpa[0]?.avg || 0).toFixed(2)),
        branches: branches.map(b => ({ name: b._id, count: b.count })),
        yearDist: yearDist.map(y => ({ year: y._id, count: y.count })),
        lowAttendanceCount: lowAttendance[0]?.count || 0
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
