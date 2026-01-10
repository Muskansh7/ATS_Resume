import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext.jsx";
import Navbar from "../components/Nav.jsx";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [userIdOrEmail, setUserIdOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const payload = new FormData();
      payload.append("userIdOrEmail", userIdOrEmail);
      payload.append("password", password);

      const res = await fetch("http://127.0.0.1:8000/login", {
        method: "POST",
        body: payload,
        headers: { Accept: "application/json" },
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.detail || "Invalid login credentials");
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
    }
  };

  return (
    <>
      {/* SAME HEADER AS LANDING PAGE */}
      <Navbar />

      {/* PAGE CONTENT OFFSET FOR FIXED NAVBAR */}
      <div className="login-page-wrapper">
        <div className="login-container">
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

              <button type="submit" className="login-btn">
                Login →
              </button>
            </form>

            <p className="signup-text">
              Don’t have an account? <Link to="/signup">Create Account</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
