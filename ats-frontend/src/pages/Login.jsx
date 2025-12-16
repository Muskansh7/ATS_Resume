import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext.jsx";
import "./Login.css";
import { API_BASE_URL } from "../config";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [userIdOrEmail, setUserIdOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("userIdOrEmail", userIdOrEmail);
      formData.append("password", password);

      const res = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.detail || "Invalid login credentials");
        setLoading(false);
        return;
      }

      localStorage.setItem("token", data.token);
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      login();
      navigate("/upload");

    } catch (err) {
      console.error(err);
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="bg-blur-circle circle1"></div>
      <div className="bg-blur-circle circle2"></div>

      <div className="login-box">
        <h2 className="login-title">Welcome Back</h2>
        <p className="login-subtitle">Login to continue</p>

        <form onSubmit={handleLogin} className="login-form">
          <div className="input-group">
            <label>Email or User ID</label>
            <input
              value={userIdOrEmail}
              onChange={(e) => setUserIdOrEmail(e.target.value)}
              placeholder="Enter your email or ID"
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          {error && <p className="error-text">{error}</p>}

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Logging in..." : "Login →"}
          </button>
        </form>

        <p className="signup-text">
          Don’t have an account? <Link to="/signup">Create Account</Link>
        </p>
      </div>
    </div>
  );
}
