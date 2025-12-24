import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import "./Result.css";

/*
  Premium Result page with C1 thick gradient ATS ring.
  Works with backend keys: resumeText, skills, requiredSkills,
  missingSkills, matchScore, atsScore, toneScore, contentScore,
  structureScore, skillScore, weaknesses, suggestions, keywordMatch.
*/

const clamp = (v, lo = 0, hi = 100) => Math.max(lo, Math.min(hi, Number(v) || 0));

/* AtsCircle - thick gradient ring */
const AtsCircle = ({ value = 0, size = 160, stroke = 14 }) => {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = clamp(value) / 100;
  const dashoffsetTarget = circumference * (1 - pct);

  const [dashoffset, setDashoffset] = useState(circumference);

  useEffect(() => {
    // small animation
    const id = requestAnimationFrame(() => setDashoffset(dashoffsetTarget));
    return () => cancelAnimationFrame(id);
  }, [dashoffsetTarget]);

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="ats-svg">
      <defs>
        <linearGradient id="atsGrad" x1="0" x2="1">
          <stop offset="0%" stopColor="#6C47FF" />
          <stop offset="100%" stopColor="#B68CFF" />
        </linearGradient>
      </defs>

      <g transform={`translate(${size / 2}, ${size / 2})`}>
        <circle r={radius} fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth={stroke} />
        <circle
          r={radius}
          fill="none"
          stroke="url(#atsGrad)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashoffset}
          transform="rotate(-90)"
          className="ats-progress"
        />
      </g>

      <foreignObject x={(size / 2) - 48} y={(size / 2) - 28} width="96" height="56">
        <div className="ats-center">
          <div className="ats-number">{Math.round(clamp(value))}%</div>
          <div className="ats-label">ATS</div>
        </div>
      </foreignObject>
    </svg>
  );
};

const MiniBar = ({ label, value }) => {
  const pct = clamp(value);
  return (
    <div className="mini-bar">
      <div className="mini-head">
        <strong>{label}</strong>
        <span>{pct}%</span>
      </div>
      <div className="mini-track">
        <div className="mini-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
};

const Result = () => {
  const location = useLocation();

  // raw data from navigation state or session storage fallback
  const raw =
    location.state?.data ||
    JSON.parse(sessionStorage.getItem("lastAnalysis") || "null");

  if (!raw) {
    return (
      <div className="no-data-wrap">
        <div className="no-data-card">
          <h2>No analysis found</h2>
          <p>Please upload a resume first.</p>
          <Link to="/upload" className="btn-primary">Go to Upload</Link>
        </div>
      </div>
    );
  }

  // map supported backend keys (defensive)
  const resumeText = raw.resumeText || raw.resume_text || "";
  const skills = raw.skills || raw.skills_found || [];
  const requiredSkills = raw.requiredSkills || raw.required_skills || [];
  const missing = raw.missingSkills || raw.missing || [];
  const atsScore = Number(raw.atsScore ?? raw.ats ?? raw.ats_score ?? 0);
  const matchScore = Number(raw.matchScore ?? raw.match ?? raw.match_score ?? 0);
  const toneScore = Number(raw.toneScore ?? raw.tone_score ?? raw.tone ?? 0);
  const contentScore = Number(raw.contentScore ?? raw.content_score ?? raw.content ?? 0);
  const structureScore = Number(raw.structureScore ?? raw.structure_score ?? raw.structure ?? 0);
  const skillScore = Number(raw.skillScore ?? raw.skillsScore ?? raw.skills_score ?? 0);
  const weaknesses = Array.isArray(raw.weaknesses) ? raw.weaknesses : (raw.weaknesses ? [raw.weaknesses] : []);
  const suggestions = Array.isArray(raw.suggestions) ? raw.suggestions : (raw.suggestions ? [raw.suggestions] : []);

  // persist last response so refresh keeps it
  useEffect(() => {
    try {
      sessionStorage.setItem("lastAnalysis", JSON.stringify(raw));
    } catch (e) {
      // ignore storage errors
    }
  }, [raw]);

  return (
    <div className="result-page">

      {/* Header gradient (matches home) */}
      <header className="result-header">
        <h1>Your Resume Analysis</h1>
        <p>Personalized insights, ATS score, and actionable suggestions</p>
      </header>

      {/* Main layout */}
      <main className="result-main">
        <div className="left-col">

          <section className="card resume-card">
            <h3>Resume (extracted)</h3>
            <pre className="resume-text">{resumeText}</pre>
          </section>

          <section className="card">
            <h3>Skills found</h3>
            <div className="chips">
              {skills.length ? skills.map((s, i) => (
                <span key={i} className="chip">{s}</span>
              )) : <p className="muted">No skills extracted.</p>}
            </div>
          </section>

          <section className="card">
            <h3>Missing skills</h3>
            {missing.length ? (
              <div className="chips">
                {missing.map((m, i) => <span key={i} className="chip missing">{m}</span>)}
              </div>
            ) : <p className="muted">No missing skills — great job!</p>}
          </section>

          <section className="card split-grid">
            <div>
              <h3>Weaknesses</h3>
              <ul className="muted-list">
                {weaknesses.length ? weaknesses.map((w, i) => <li key={i}>{w}</li>) : <li>No weaknesses detected.</li>}
              </ul>
            </div>
            <div>
              <h3>Suggestions</h3>
              <ol className="muted-list">
                {suggestions.length ? suggestions.map((s, i) => <li key={i}>{s}</li>) : <li>No suggestions.</li>}
              </ol>
            </div>
          </section>

        </div>

        <aside className="right-col">

          <div className="card ats-card">
            <AtsCircle value={atsScore} size={190} stroke={16} />
            <div className="ats-values">
              <div className="ats-big">{atsScore.toFixed(2)}%</div>
              <div className="ats-match">Match: {matchScore.toFixed(2)}%</div>
            </div>

            <div className="breakdown">
              <MiniBar label="Tone" value={toneScore} />
              <MiniBar label="Content" value={contentScore} />
              <MiniBar label="Structure" value={structureScore} />
              <MiniBar label="Skills" value={skillScore} />
            </div>
          </div>

          <div className="card quick-card">
            <h4>Quick stats</h4>
            <p><strong>Skills:</strong> {skills.length}</p>
            <p><strong>Missing:</strong> {missing.length}</p>
            <p><strong>Required:</strong> {requiredSkills.length}</p>
            <p><strong>Keywords matched:</strong> {raw.keywordMatch ?? raw.keyword_count ?? 0}</p>
          </div>

          <div className="card actions-card">
            <h4>Actions</h4>
            <div className="actions">
              <Link to="/upload" className="btn-primary">Analyze another</Link>
              <button
                className="btn-outline"
                onClick={() => navigator.clipboard?.writeText(resumeText)}
                title="Copy resume text">Copy resume text
              </button>
            </div>
          </div>

        </aside>
      </main>
    </div>
  );
};

export default Result;
