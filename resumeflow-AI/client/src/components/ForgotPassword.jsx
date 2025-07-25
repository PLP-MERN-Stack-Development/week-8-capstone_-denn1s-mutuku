import { useState } from "react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // API call to backend for password reset
      const res = await fetch("http://localhost:5000/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      setMessage(data.message || "If this email is registered, check your inbox.");
    } catch (err) {
      setMessage("Something went wrong.");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md mt-10">
      <h2 className="text-xl font-bold mb-4 text-center">Forgot Password</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Enter your email"
          className="w-full p-3 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 hover:scale-[1.01] text-white p-3 rounded transition duration-200 ease-in-out"
        >
          Send Reset Link
        </button>
        {message && <p className="text-green-600 text-sm text-center">{message}</p>}
      </form>
    </div>
  );
};

export default ForgotPassword;
