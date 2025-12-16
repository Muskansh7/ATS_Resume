import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Signup.css";
import { API_BASE_URL } from "../config";

export default function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    userId: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const payload = new FormData();
      payload.append("full_name", form.fullName);
      payload.append("email", form.email);
      payload.append("phone", form.phone);
      payload.append("user_id", form.userId);
      payload.append("password", form.password);

      const res = await fetch(`${API_BASE_URL}/signup`, {
        method: "POST",
        body: payload,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.detail || "Signup failed");
        return;
      }

      navigate("/login");

    } catch (err) {
      console.error(err);
      setError("Could not connect to server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-wrapper">
      <div className="signup-card">
        <h2>Create Account</h2>

        <form onSubmit={handleSignup}>
          <input name="fullName" placeholder="Full Name" onChange={handleChange} required />
          <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
          <input name="phone" placeholder="Phone" onChange={handleChange} required />
          <input name="userId" placeholder="User ID" onChange={handleChange} required />
          <input name="password" type="password" placeholder="Password" onChange={handleChange} required />

          {error && <p className="error-text">{error}</p>}

          <button disabled={loading}>
            {loading ? "Creating..." : "Create Account →"}
          </button>
        </form>

        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
