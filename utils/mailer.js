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

// ✅ CHANGE 2: Verify connection (VERY IMPORTANT FOR DEBUG)
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ SMTP Connection Error:", error);
  } else {
    console.log("✅ SMTP Server is ready to send emails");
  }
});


// Function to send email with OTP
const sendOTPEmail = async (email, otp) => {
  try {
    console.log("📩 Sending OTP to:", email);

    // ✅ CHANGE 3: Validate email before sending
    if (!email) {
      throw new Error("Email is missing");
    }

    const mailOptions = {
      from: `"Todo App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your OTP Code',

      // ✅ CHANGE 5: Add TEXT fallback (important)
      text: `Your OTP is ${otp}. It is valid for 5 minutes.`,
      
      html: `
        <h2>Your OTP is: <b>${otp}</b></h2>
        <p>This OTP is valid for 5 minutes.</p>
      `,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("✅ Email sent:", info.response);

    return true;
  } catch (error) {
    // ✅ CHANGE 8: Full detailed error logging
    console.error("❌ EMAIL ERROR FULL:", {
      message: error.message,
      stack: error.stack,
    });

    throw error;
  }
};
module.exports = sendOTPEmail;
