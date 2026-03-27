// mailer.js
require('dotenv').config();
const { Resend } = require('resend');

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Function to send OTP email
const sendOTPEmail = async (email, otp) => {
  try {
    console.log("📩 Sending OTP to:", email);

    const response = await resend.emails.send({
      from: 'onboarding@resend.dev', // default working sender
      to: email,
      subject: 'Your OTP Code',
      html: `
        <h2>Your OTP is: <b>${otp}</b></h2>
        <p>This OTP is valid for 5 minutes.</p>
      `,
    });

    console.log("✅ Email sent:", response);

    return true;
  } catch (error) {
    console.error("❌ Email error:", error);
    throw error;
  }
};

module.exports = sendOTPEmail;