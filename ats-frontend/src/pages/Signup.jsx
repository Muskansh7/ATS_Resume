import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Nav.jsx";
import "./Signup.css";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

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

      const res = await fetch(`${API_BASE}/signup`, {
        method: "POST",
        body: payload,
        headers: {
          Accept: "application/json",
        },
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.detail || "Signup failed");
        return;
      }

      // redirect after success
      navigate("/login");
    } catch (err) {
      console.error(err);
      setError("Server unreachable. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="signup-page-wrapper">
        <div className="signup-wrapper">
          <div className="signup-card fade-in">
            <h2>Create Account</h2>

            <form className="signup-form" onSubmit={handleSignup}>
              <label>Full Name</label>
              <input
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                required
              />

              <label>Email</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
              />

              <label>Phone Number</label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                required
              />

              <label>User ID</label>
              <input
                name="userId"
                value={form.userId}
                onChange={handleChange}
                required
              />

              <label>Password</label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                required
              />

              {error && <p className="error-text">{error}</p>}

              <button disabled={loading}>
                {loading ? "Creating Account..." : "Create Account →"}
              </button>
            </form>

            <p className="switch-text">
              Already have an account? <Link to="/login">Login</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
