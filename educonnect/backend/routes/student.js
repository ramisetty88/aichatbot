const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const Student = require('../models/Student');

router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const student = await Student.findById(req.user.studentId);
    if (!student) return res.status(404).json({ success: false, message: 'Student not found.' });
    res.json({ success: true, data: student });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

module.exports = router;
