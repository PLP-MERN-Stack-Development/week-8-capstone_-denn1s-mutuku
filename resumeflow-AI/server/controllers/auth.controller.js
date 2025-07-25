// controllers/auth.controller.js

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { sendResetEmail } from "../utils/sendEmail.js"; // ✅ Email util

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

// ✅ Signup
export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ error: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ fullName, email, password: hashedPassword });
    await newUser.save();

    return res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.error("❌ Signup error:", err.message);
    return res.status(500).json({ error: "Server error" });
  }
};

// ✅ Login
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 2 * 60 * 60 * 1000,
    });

    return res.json({
      message: "Login successful",
      user: { fullName: user.fullName, email: user.email },
    });
  } catch (err) {
    console.error("❌ Login error:", err.message);
    return res.status(500).json({ error: "Server error" });
  }
};

// ✅ Logout
export const logout = (req, res) => {
  res.clearCookie("token");
  return res.json({ message: "Logged out successfully" });
};

// ✅ Forgot Password (Enhanced with Logs)
export const forgotPassword = async (req, res) => {
  console.log("📩 [FORGOT PASSWORD] Route hit");

  const { email } = req.body;
  console.log("📨 [INPUT] Email received:", email);

  try {
    const user = await User.findOne({ email });

    if (!user) {
      console.warn("❌ [USER NOT FOUND] No account for:", email);
      return res.status(404).json({ error: "User not found" });
    }

    console.log("✅ [USER FOUND] User ID:", user._id);

    const resetToken = Math.random().toString(36).substring(2);
    const resetTokenExpiry = Date.now() + 60 * 60 * 1000; // 1 hour

    console.log("🔐 [TOKEN GENERATED] Token:", resetToken);
    console.log("⏳ [EXPIRY TIME] Token expires at:", new Date(resetTokenExpiry).toISOString());

    user.resetToken = resetToken;
    user.resetTokenExpiry = resetTokenExpiry;
    await user.save();
    console.log("💾 [USER SAVED] Token & expiry stored");

    await sendResetEmail(user.email, resetToken);
    console.log("📤 [EMAIL SENT] Reset email sent to:", user.email);

    return res.status(200).json({ message: "Reset link sent to your email." });

  } catch (err) {
    console.error("🔥 [SERVER ERROR] Forgot Password Error:", err.message);
    return res.status(500).json({ error: "Server error" });
  }
};

// ✅ Reset Password
export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() },
    });

    if (!user)
      return res.status(400).json({ error: "Invalid or expired token" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    return res.status(200).json({ message: "Password reset successful." });
  } catch (err) {
    console.error("❌ Reset Password error:", err.message);
    return res.status(500).json({ error: "Server error" });
  }
};
