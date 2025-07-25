// routes/auth.routes.js

import express from "express";
import {
  signup,
  login,
  logout,
  forgotPassword,
  resetPassword
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/logout", logout);

router.get("/ping", (req, res) => res.send("pong"));

// ✅ Add these two routes:
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

export default router;
