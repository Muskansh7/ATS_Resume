import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Nav.jsx";
import "./Signup.css";

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

    const payload = new FormData();
    payload.append("full_name", form.fullName);
    payload.append("email", form.email);
    payload.append("phone", form.phone);
    payload.append("user_id", form.userId);
    payload.append("password", form.password);

    try {
      const res = await fetch("http://127.0.0.1:8000/signup", {
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
    <>
      {/* SAME HEADER AS LANDING & LOGIN */}
      <Navbar />

      {/* OFFSET FOR FIXED NAVBAR */}
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
