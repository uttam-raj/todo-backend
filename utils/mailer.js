// mailer.js
require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
 host: "smtp.gmail.com",
  port: 465,
  secure: true, // VERY IMPORTANT
  auth: {
    user: process.env.EMAIL_USER,     // Your email
    pass: process.env.EMAIL_PASS,     // Your email password or App Password
  },
});

// Function to send email with OTP
const sendOTPEmail = async (email, otp) => {
  try {
    console.log("📩 Sending OTP to:", email);

    const mailOptions = {
      from: `"Todo App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your OTP Code',
      html: `<h2>Your OTP is: <b>${otp}</b></h2><p>This OTP is valid for 5 minutes.</p>`,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("✅ Email sent:", info.response);
  } catch (error) {
    console.error("❌ Email error:", error);
    throw error; // VERY IMPORTANT
  }
};
module.exports = sendOTPEmail;
