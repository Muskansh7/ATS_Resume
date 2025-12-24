import React from "react";
import { Link } from "react-router-dom";

export default function JobCard({ j }) {
  return (
    <div className="jobcard">
      <h3>{j.title}</h3>
      <p className="muted">{j.location}</p>
      <p>{j.desc}</p>
      <Link to={`/jobs/${j.id}`} className="btn">View / Apply</Link>
    </div>
  );
}
