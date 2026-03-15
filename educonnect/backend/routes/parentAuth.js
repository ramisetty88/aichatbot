const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Student = require('../models/Student');
const OTP = require('../models/OTP');
const { sendOTP } = require('../utils/sms');

function genOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Step 1: Verify reg number + parent phone, then send OTP
router.post('/verify', async (req, res) => {
  try {
    const { registrationNumber, parentPhone } = req.body;

    if (!registrationNumber || !parentPhone) {
      return res.status(400).json({ success: false, message: 'Registration number and phone are required.' });
    }

    if (!/^\d{10}$/.test(parentPhone.trim())) {
      return res.status(400).json({ success: false, message: 'Enter a valid 10-digit mobile number.' });
    }

    const student = await Student.findOne({ registrationNumber: registrationNumber.toUpperCase().trim() });
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found. Please check the registration number.' });
    }

    if (student.parentPhone !== parentPhone.trim()) {
      return res.status(401).json({ success: false, message: 'Phone number does not match our records.' });
    }

    const otp = genOTP();
    await OTP.deleteMany({ registrationNumber: student.registrationNumber });
    await OTP.create({ phone: parentPhone.trim(), registrationNumber: student.registrationNumber, otp });

    const smsResult = await sendOTP(parentPhone.trim(), otp);

    let message;
    if (!smsResult || smsResult.demo) {
      message = `Demo OTP: ${otp}  (SMS disabled — add FAST2SMS_API_KEY in .env to enable real SMS)`;
    } else {
      message = `OTP sent to ****${parentPhone.slice(-4)}. Check your SMS inbox.`;
    }

    return res.json({
      success: true,
      message,
      studentName: student.name,
      maskedPhone: '****' + parentPhone.slice(-4),
      smsMode: smsResult.demo ? 'demo' : 'real'
    });

  } catch (err) {
    console.error('Verify error:', err);
    res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
});

// Step 2: Verify OTP and issue JWT
router.post('/verify-otp', async (req, res) => {
  try {
    const { registrationNumber, otp } = req.body;

    if (!registrationNumber || !otp) {
      return res.status(400).json({ success: false, message: 'Registration number and OTP are required.' });
    }

    const record = await OTP.findOne({ registrationNumber: registrationNumber.toUpperCase().trim() });
    if (!record) {
      return res.status(400).json({ success: false, message: 'OTP expired or not found. Please request a new one.' });
    }

    if (record.otp !== otp.trim()) {
      return res.status(401).json({ success: false, message: 'Invalid OTP. Please try again.' });
    }

    const student = await Student.findOne({ registrationNumber: registrationNumber.toUpperCase().trim() });
    await OTP.deleteMany({ registrationNumber: registrationNumber.toUpperCase().trim() });

    const token = jwt.sign(
      { studentId: student._id, registrationNumber: student.registrationNumber, role: 'parent' },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    return res.json({
      success: true,
      message: 'Login successful!',
      token,
      student: {
        name: student.name,
        registrationNumber: student.registrationNumber,
        branch: student.branch,
        year: student.year,
        section: student.section,
        parentName: student.parentName
      }
    });

  } catch (err) {
    console.error('OTP verify error:', err);
    res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
});

module.exports = router;
