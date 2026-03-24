// mailer.js
require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail', // You can use others like Outlook, Yahoo, etc.
  auth: {
    user: process.env.EMAIL_USER,     // Your email
    pass: process.env.EMAIL_PASS,     // Your email password or App Password
  },
});

// Function to send email with OTP
const sendOTPEmail = async (email, otp) => {
  const mailOptions = {
    from: `"Todo App" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Your OTP Code',
    html: `<h2>Your OTP is: <b>${otp}</b></h2><p>This OTP is valid for 5 minutes.</p>`,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendOTPEmail;
