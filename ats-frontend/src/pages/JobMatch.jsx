import React from "react";
import "../Landing.css"; // Reuse your global styles for consistency

export default function JobMatch() {
  // Example static data — Replace with real backend response later
  const matchScore = 87;
  const matchedSkills = ["React", "JavaScript", "Node.js", "REST API"];
  const missingSkills = ["GraphQL", "Docker", "AWS"];
  const recommendations = [
    "Add more measurable achievements.",
    "Include DevOps-related tools like Docker or Kubernetes.",
    "Highlight cloud experience to match job requirements."
  ];

  return (
    <div className="result-wrapper">

      <div className="result-card">
        <h1 className="result-title">Job Match Score</h1>

        {/* Score Circle */}
        <div className="score-circle">
          <h2>{matchScore}%</h2>
        </div>

        {/* Matched Skills */}
        <div className="result-section">
          <h3>Matched Skills ✅</h3>
          <div className="badge-container">
            {matchedSkills.map((skill, i) => (
              <span key={i} className="badge green">{skill}</span>
            ))}
          </div>
        </div>

        {/* Missing Skills */}
        <div className="result-section">
          <h3>Missing / Weak Skills ⚠️</h3>
          <div className="badge-container">
            {missingSkills.map((skill, i) => (
              <span key={i} className="badge yellow">{skill}</span>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        <div className="result-section">
          <h3>AI Recommendations 💡</h3>
          <ul>
            {recommendations.map((tip, i) => (
              <li key={i}>{tip}</li>
            ))}
          </ul>
        </div>

        <button className="back-btn" onClick={() => (window.location.href = "/upload")}>
          Upload Another Resume →
        </button>
      </div>
    </div>
  );
}
