import axios from "axios";

// ✅ Create an Axios instance with correct config
const api = axios.create({
  baseURL: "http://localhost:5000/api", // Backend base URL
  withCredentials: true,               // Allow sending cookies/JWT
});

// ✅ Export your API functions
export const signup = (data) => api.post("/signup", data);
export const login = (data) => api.post("/login", data);
// You can add more API functions below...
export const forgotPassword = (data) => api.post("/forgot-password", data);