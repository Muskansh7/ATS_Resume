import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function Nav() {
  const l = useLocation();
  return (
    <nav className="nav">
      <div className="nav-inner">
        <div className="brand">ATS</div>
        <div className="links">
          <Link className={l.pathname.startsWith("/jobs") ? "active" : ""} to="/jobs">Jobs</Link>
          <Link className={l.pathname === "/candidates" ? "active" : ""} to="/candidates">Candidates</Link>
        </div>
      </div>
    </nav>
  );
}
