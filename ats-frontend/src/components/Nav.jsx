import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Nav.css";

export default function Navbar() {
  const l = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const hideUpload =
    l.pathname === "/login" || l.pathname === "/signup";

  return (
    <nav className={`navbar ${scrolled ? "navbar-scrolled" : ""}`}>
      <div className="navbar-inner">
        <div className="logo">AI Resume Analyzer</div>

        <div className="nav-links">
          <Link to="/" className={l.pathname === "/" ? "active" : ""}>
            Home
          </Link>

          <Link to="/login" className={l.pathname === "/login" ? "active" : ""}>
            Login
          </Link>

          <Link to="/signup" className={l.pathname === "/signup" ? "active" : ""}>
            Signup
          </Link>

          {!hideUpload && (
            <Link to="/upload" className="nav-button">
              Upload Resume
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
