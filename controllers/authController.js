const User = require("../models/user-model");
const bcrypt = require("bcryptjs");
const sendOTPEmail = require("../utils/mailer");

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "Invalid Email ID" });

    const isMatch = await bcrypt.compare(password, user.password);

    console.log("Login password (plain):", password);
    console.log("Stored hashed password:", user.password);
    console.log("Password match result:", isMatch);


    if (!isMatch) return res.status(401).json({ message: "Invalid password" });

    if (!user.isVerified)
      return res.status(403).json({ message: "Account not verified" });

    const Token = await user.generateToken();

    res.cookie("token", Token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    });

    res.status(200).json({
      message: "Login successful",
      token: Token,
      userId: user._id.toString(),
    });
  } catch (error) {
    next(error);
  }
};

const register = async (req, res, next) => {
  const { name, email, phone, password, gender } = req.body;

  try {
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({ message: "User already exists" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
    const otpExpirationTime = Date.now() + 5 * 60 * 1000;

    const userCreated = await User.create({
      name,
      email,
      phone,
      password,
      gender,
      isVerified: false,
      otp,
      otpExpirationTime,
    });

    try {
  await sendOTPEmail(email, otp);
} catch (error) {
  return res.status(500).json({
    message: "OTP sending failed",
    error: error.message,
  });
}

    return res.status(201).json({
      message: "userCreated",
      token: await userCreated.generateToken(),
      userID: userCreated._id.toString(),
    });
  } catch (error) {
    next(error);
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });

    if (!user)
      return res.status(404).json({ message: "User not found" });

    if (user.otp.toString() !== otp.toString() || user.otpExpirationTime < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpirationTime = undefined;
    await user.save();

    res.status(200).json({ message: "User Register successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(401).json({ message: "User not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpirationTime = Date.now() + 5 * 60 * 1000;

    user.otp = otp;
    user.otpExpirationTime = otpExpirationTime;
    await user.save();

    await sendOTPEmail(email, otp);

    res.status(200).json({ message: "OTP sent to email/phone" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword, confirmPassword } = req.body;

    // console.log("RESET REQUEST:", req.body);

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const user = await User.findOne({ email });

    if (!user)
      return res.status(404).json({ message: "User not found" });

    if (user.otp !== otp || user.otpExpirationTime < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = newPassword;
    user.otp = undefined;
    user.otpExpirationTime = undefined;

    await user.save();
    // console.log("Password updated:", user.password);
    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = {
  register,
  verifyOtp,
  login,
  forgotPassword,
  resetPassword,
};
