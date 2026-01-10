import { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import "./Result.css";

/* ------------------ helpers ------------------ */
const clamp = (v, lo = 0, hi = 100) =>
  Math.max(lo, Math.min(hi, Number(v) || 0));

/* ------------------ ATS CIRCLE ------------------ */
const AtsCircle = ({ value = 0 }) => {
  const size = 170;
  const stroke = 14;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - clamp(value) / 100);

  return (
    <svg width={size} height={size}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="#e5e7eb"
        strokeWidth={stroke}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="#8b5a2b"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: "stroke-dashoffset 1s ease" }}
      />
      <text x="50%" y="46%" textAnchor="middle" className="ats-score">
        {Math.round(clamp(value))}%
      </text>
      <text x="50%" y="58%" textAnchor="middle" className="ats-label">
        ATS
      </text>
    </svg>
  );
};

/* ------------------ MINI BAR ------------------ */
const MiniBar = ({ label, value }) => (
  <div className="mini-bar">
    <div className="mini-head">
      <span>{label}</span>
      <strong>{clamp(value)}%</strong>
    </div>
    <div className="mini-track">
      <div
        className="mini-fill"
        style={{ width: `${clamp(value)}%` }}
      />
    </div>
  </div>
);

/* ------------------ RESULT PAGE ------------------ */
export default function Result() {
  const { state } = useLocation();

  const data =
    state?.data ||
    JSON.parse(sessionStorage.getItem("lastAnalysis") || "null");

  useEffect(() => {
    if (data) {
      sessionStorage.setItem("lastAnalysis", JSON.stringify(data));
    }
  }, [data]);

  if (!data) {
    return (
      <div className="no-data-wrap">
        <div className="no-data-card">
          <h2>No analysis found</h2>
          <Link to="/upload">Upload Resume</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="result-page">
      <div className="result-container">

        {/* HEADER */}
        <div className="result-header">
          <h1>Resume Analysis</h1>
          <p>
            Job Match Score: <b>{clamp(data.matchScore)}%</b>
          </p>
        </div>

        <div className="result-main">

          {/* LEFT COLUMN */}
          <div className="left-col">

            {/* Resume Preview */}
            <div className="card">
              <h3>Resume Preview</h3>
              <pre className="resume-text">
                {data.resumeText && data.resumeText.trim().length > 0
                  ? data.resumeText
                  : "No resume text available"}
              </pre>
            </div>

            {/* Skills */}
            <div className="card">
              <h3>Skills Found</h3>
              <div className="chips">
                {Array.isArray(data.skills) && data.skills.length > 0 ? (
                  data.skills.map((s, i) => (
                    <span key={i} className="chip">{s}</span>
                  ))
                ) : (
                  <span className="muted">No skills detected</span>
                )}
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN */}
          <div className="right-col">

            {/* ATS Score */}
            <div className="card ats-card">
              <AtsCircle value={data.atsScore} />
              <MiniBar label="Tone" value={data.toneScore} />
              <MiniBar label="Content" value={data.contentScore} />
              <MiniBar label="Structure" value={data.structureScore} />
              <MiniBar label="Skills" value={data.skillScore} />
            </div>

            {/* Weaknesses */}
            <div className="card">
              <h3>Weaknesses</h3>
              <ul className="muted-list">
                {Array.isArray(data.weaknesses) && data.weaknesses.length > 0 ? (
                  data.weaknesses.map((w, i) => (
                    <li key={i}>{w}</li>
                  ))
                ) : (
                  <li>No major weaknesses detected</li>
                )}
              </ul>
            </div>

            {/* Suggestions */}
            <div className="card">
              <h3>Suggestions</h3>
              <ul className="muted-list">
                {Array.isArray(data.suggestions) && data.suggestions.length > 0 ? (
                  data.suggestions.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))
                ) : (
                  <li>Your resume is well-structured. Minor improvements only.</li>
                )}
              </ul>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
