import { Link, useLocation } from "react-router-dom";
import "./Nav.css";

export default function Navbar() {
  const l = useLocation();

  return (
    <nav className="navbar">
      <div className="logo">AI Resume Analyzer</div>

      <div className="nav-links">
        <Link to="/" className={l.pathname === "/" ? "active" : ""}>Home</Link>
        <Link to="/login" className={l.pathname === "/login" ? "active" : ""}>Login</Link>
        <Link to="/signup" className={l.pathname === "/signup" ? "active" : ""}>Signup</Link>
        <Link to="/upload" className="nav-button">Upload Resume</Link>
      </div>
    </nav>
  );
}
