import React, { useState } from "react";
import Card from "../components/ui/Card";

const API_BASE = "http://localhost:5000/api/auth";

export default function AuthPage({ setUser, setPage }) {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    bio: "",
    domain: "",
    skills: "",
    experience: "",
    budgetRange: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAuth = async () => {
    setError("");

    try {
      const endpoint = isLogin ? "login" : "signup";

      const payload = isLogin
        ? { email: form.email, password: form.password }
        : {
            ...form,
            skills: form.skills
              ? form.skills.split(",").map((s) => s.trim())
              : [],
          };

      const res = await fetch(`${API_BASE}/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!data.success) return setError(data.message);

      localStorage.setItem("token", data.token);
      setUser(data.user);

      // Role based redirect
      if (data.user.role === "Innovator") setPage("feed");
      else if (data.user.role === "Investor") setPage("projects");
      else if (data.user.role === "Mentor") setPage("dashboard");
      else setPage("profile");
    } catch (err) {
      console.error(err);
      setError("Server error. Try again later.");
    }
  };

  return (
    <div className="min-h-screen bg-white flex justify-center items-center p-6">
      <Card className="max-w-lg w-full p-8">
        <h2 className="text-3xl font-serif font-bold mb-6 text-center">
          {isLogin ? "Welcome Back" : "Join Udaan"}
        </h2>

        {!isLogin && (
          <>
            <input
              className="w-full p-3 mb-3 border rounded-lg"
              placeholder="Full Name"
              name="name"
              onChange={handleChange}
            />

            {/* Role Selection */}
            <select
              className="w-full p-3 mb-3 border rounded-lg"
              name="role"
              value={form.role}
              onChange={handleChange}
            >
              <option value="">Select Role</option>
              <option value="Innovator">Innovator</option>
              <option value="Investor">Investor</option>
              <option value="Mentor">Mentor</option>
            </select>

            {/* Dynamic Role Fields */}
            {form.role === "Innovator" && (
              <>
                <input
                  className="w-full p-3 mb-3 border rounded-lg"
                  placeholder="Domain (e.g. AI, HealthTech)"
                  name="domain"
                  onChange={handleChange}
                />
                <input
                  className="w-full p-3 mb-3 border rounded-lg"
                  placeholder="Skills (comma separated)"
                  name="skills"
                  onChange={handleChange}
                />
              </>
            )}

            {form.role === "Investor" && (
              <>
                <input
                  className="w-full p-3 mb-3 border rounded-lg"
                  placeholder="Industry of Interest"
                  name="domain"
                  onChange={handleChange}
                />
                <input
                  className="w-full p-3 mb-3 border rounded-lg"
                  placeholder="Budget Range (₹10L–₹5Cr)"
                  name="budgetRange"
                  onChange={handleChange}
                />
              </>
            )}

            {form.role === "Mentor" && (
              <>
                <input
                  className="w-full p-3 mb-3 border rounded-lg"
                  placeholder="Expertise (e.g. Product Strategy)"
                  name="domain"
                  onChange={handleChange}
                />
                <input
                  className="w-full p-3 mb-3 border rounded-lg"
                  placeholder="Years of Experience"
                  name="experience"
                  onChange={handleChange}
                />
              </>
            )}

            <textarea
              className="w-full p-3 mb-3 border rounded-lg"
              placeholder="Short Bio (optional)"
              name="bio"
              onChange={handleChange}
            />
          </>
        )}

        {/* Common Fields */}
        <input
          className="w-full p-3 mb-3 border rounded-lg"
          placeholder="Email"
          type="email"
          name="email"
          onChange={handleChange}
        />
        <input
          className="w-full p-3 mb-3 border rounded-lg"
          placeholder="Password"
          type="password"
          name="password"
          onChange={handleChange}
        />

        {error && (
          <p className="text-red-500 text-sm mb-3 text-center">{error}</p>
        )}

        <button
          className="w-full bg-black text-white p-3 rounded-xl mb-3"
          onClick={handleAuth}
        >
          {isLogin ? "Login" : "Create Account"}
        </button>

        <p className="text-center">
          {isLogin ? "New here?" : "Already have an account?"}{" "}
          <span
            className="text-blue-600 cursor-pointer font-medium"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Sign Up" : "Sign In"}
          </span>
        </p>
      </Card>
    </div>
  );
}
