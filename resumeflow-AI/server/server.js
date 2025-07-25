import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes.js";

dotenv.config();

const app = express();

// ✅ Allowed frontend origins (localhost + Vercel)
const allowedOrigins = [
  "http://localhost:5173",
  "https://resumeflow-ai-fhyc.vercel.app", // ✅ your deployed frontend
];

// ✅ CORS middleware
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // Allow SSR or same-origin tools like Postman
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error(`❌ CORS Error: Origin ${origin} not allowed`));
    },
    credentials: true,
  })
);

// ✅ Other middleware
app.use(express.json());
app.use(cookieParser());

// ✅ Disable caching
app.use((req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});

// ✅ Routes
app.use("/api", authRoutes);

// ✅ MongoDB connection
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/resume-ai";

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(PORT, () =>
      console.log(`🚀 Server running on http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
  });
