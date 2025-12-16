import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
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
      const payload = new FormData();
      payload.append("userIdOrEmail", userIdOrEmail);
      payload.append("password", password);

      const res = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        body: payload,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.detail || "Login failed");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      login();
      navigate("/upload");

    } catch (err) {
      console.error(err);
      setError("Could not connect to server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Welcome Back</h2>
        <p>Login to continue</p>

        <form onSubmit={handleLogin}>
          <label>Email or User ID</label>
          <input
            value={userIdOrEmail}
            onChange={(e) => setUserIdOrEmail(e.target.value)}
            required
          />

          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <p className="error-text">{error}</p>}

          <button disabled={loading}>
            {loading ? "Logging in..." : "Login →"}
          </button>
        </form>

        <p>
          Don’t have an account? <Link to="/signup">Create Account</Link>
        </p>
      </div>
    </div>
  );
}
