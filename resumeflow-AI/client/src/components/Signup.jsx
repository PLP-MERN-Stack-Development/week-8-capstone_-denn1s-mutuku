import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signup } from "../services/api";

const Signup = () => {
  const [form, setForm] = useState({ fullName: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{5,})/;

    if (!form.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!emailRegex.test(form.email)) newErrors.email = "Invalid email format";
    if (!passwordRegex.test(form.password))
      newErrors.password = "Password must contain 1 uppercase, 1 special char, min length 5";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    console.log("📤 Submitting form with:", form);

    try {
      const res = await signup(form);
      console.log("✅ Signup success:", res?.data);

      setMessage("🎉 Account created successfully! Redirecting to login...");
      setForm({ fullName: "", email: "", password: "" }); // Clear the form

      // Ensure redirect after delay
      setTimeout(() => {
        console.log("🔀 Navigating to /login...");
        navigate("/login");
      }, 1500);
    } catch (err) {
      console.error("❌ Signup error:", err?.response?.data || err.message);
      setMessage(err?.response?.data?.error || "Signup failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-md space-y-6 transition duration-300 ease-in-out"
      >
        <h2 className="text-2xl font-bold text-center">Create Account</h2>

        {message && <p className="text-blue-600 text-center">{message}</p>}

        <input
          type="text"
          placeholder="Full Name"
          className="w-full p-3 border rounded"
          value={form.fullName}
          onChange={(e) => setForm({ ...form, fullName: e.target.value })}
        />
        {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName}</p>}

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 border rounded"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 border rounded"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 hover:scale-[1.01] text-white p-3 rounded transition duration-200 ease-in-out"
        >
          Sign Up
        </button>

        <p className="text-center text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 font-semibold hover:underline">
            Login
          </Link>
        </p>

        {process.env.NODE_ENV === "development" && (
          <p className="text-gray-400 text-xs text-center">🛠 Dev: watching signup flow...</p>
        )}
      </form>
    </div>
  );
};

export default Signup;
