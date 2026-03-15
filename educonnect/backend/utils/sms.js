const axios = require("axios");

async function sendOTP(phoneNumber, otp) {

  const apiKey = process.env.FAST2SMS_API_KEY;

  try {

    const response = await axios.get(
      "https://www.fast2sms.com/dev/bulkV2",
      {
        headers: {
          authorization: apiKey
        },
        params: {
          route: "q",
          message: `Your EduConnect OTP is ${otp}`,
          language: "english",
          numbers: phoneNumber
        }
      }
    );

    console.log("✅ SMS Response:", response.data);

    return { success: true, demo: false };

  } catch (err) {

    console.log("❌ SMS Error:", err.response?.data || err.message);
    console.log("⚠️ Demo OTP:", otp);

    return { success: false, demo: true };
  }
}

module.exports = { sendOTP };