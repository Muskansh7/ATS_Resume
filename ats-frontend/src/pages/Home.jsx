import React from "react";
import "./Home.css";

export default function Home() {
  return (
    <div className="home-wrapper">

      <div className="hero-section">

        {/* GLASS BACKGROUND BEHIND TEXT */}
        <div className="hero-content glass-effect fade-in">

          <h1 className="hero-title">
            Transform Your Resume with <span>AI</span>
          </h1>

          <p className="hero-subtitle">
            Identify Resume Weaknesses Instantly
          </p>

          <p className="hero-desc">
            Get AI-powered insights on strengths, weaknesses, keywords, ATS score,
            and job match accuracy — all in seconds.
          </p>

          <button className="hero-btn">
            Get Started →
          </button>

        </div>
      </div>
    </div>
  );
}
