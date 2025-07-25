// utils/sendEmail.js

import nodemailer from "nodemailer";

export const sendResetEmail = async (toEmail, resetToken) => {
  const resetLink = `http://localhost:5173/reset-password/${resetToken}`;

  // Create reusable transporter using Gmail SMTP
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,       // your Gmail address
      pass: process.env.EMAIL_PASS,       // your 16-char App Password
    },
  });

  const mailOptions = {
    from: `"ResumeFlow Support" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: "Password Reset Request",
    html: `
      <p>Hello,</p>
      <p>You requested to reset your password.</p>
      <p><a href="${resetLink}">Click here to reset your password</a></p>
      <p>If you didn't request this, you can ignore this email.</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("✅ Reset email sent to:", toEmail);
  } catch (error) {
    console.error("❌ Error sending reset email:", error);
    throw new Error("Failed to send reset email");
  }
};
