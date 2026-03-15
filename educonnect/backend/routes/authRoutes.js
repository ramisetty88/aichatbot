const express = require("express");
const router = express.Router();

const { sendOTP } = require("../utils/sms");

router.post("/send-otp", async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ message: "Phone number required" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);

    // Send SMS
    await sendOTP(phone, otp);

    res.json({
      success: true,
      message: "OTP sent successfully"
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to send OTP" });
  }
});

module.exports = router;