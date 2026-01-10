import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import "../landing.css";

export default function Landing() {
  const words = [
    "Extract Skills",
    "Generate Job Match Score",
    "Identify Resume Weaknesses",
    "AI-Powered Resume Insights",
  ];

  const [i, setI] = useState(0);
  const [t, setT] = useState("");
  const [typing, setTyping] = useState(true);

  useEffect(() => {
    let typeTimer, eraseTimer;

    if (typing) {
      typeTimer = setInterval(() => {
        setT((p) => {
          const w = words[i];
          if (p.length < w.length) return w.slice(0, p.length + 1);
          setTyping(false);
          return p;
        });
      }, 70);
    } else {
      eraseTimer = setTimeout(() => {
        const erase = setInterval(() => {
          setT((p) => {
            if (p.length > 0) return p.slice(0, -1);
            clearInterval(erase);
            setTyping(true);
            setI((x) => (x + 1) % words.length);
            return "";
          });
        }, 40);
      }, 1000);
    }

    return () => {
      clearInterval(typeTimer);
      clearTimeout(eraseTimer);
    };
  }, [typing, i]);

  return (
    <main className="landing-wrapper">
      {/* ================= HERO ================= */}
      <section className="hero" id="home">
        <div className="container">
          <h1 className="hero-title">
            Transform Your Resume with <span className="highlight">AI</span>
          </h1>

          <p className="hero-typing">
            <span>{t}</span>
            <span className="cursor">|</span>
          </p>

          <p className="hero-subtext">
            Get ATS score, job match percentage, skills, and improvement insights instantly.
          </p>

          <Link to="/login" className="cta-button">
            Get Started →
          </Link>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="features features-main" id="features">
        <div className="container">
          <h2 className="section-title">Why Choose AI Resume Analyzer?</h2>

          <div className="feature-grid">
            <div className="feature-card">
              <h3>⚡ Instant Analysis</h3>
              <p>AI-powered resume insights in seconds.</p>
            </div>

            <div className="feature-card">
              <h3>🎯 Job Match Score</h3>
              <p>See how well your resume fits the role.</p>
            </div>

            <div className="feature-card">
              <h3>📊 Skill Extraction</h3>
              <p>Automatically extract hard and soft skills.</p>
            </div>

            <div className="feature-card">
              <h3>🔍 Weakness Detection</h3>
              <p>Identify gaps and missing keywords.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="features features-how" id="how-it-works">
        <div className="container">
          <h2 className="section-title">How It Works</h2>

          <div className="feature-grid">
            <div className="feature-card">
              <h3>1️⃣ Upload Resume</h3>
              <p>PDF, DOCX, or TXT format.</p>
            </div>

            <div className="feature-card">
              <h3>2️⃣ AI Analysis</h3>
              <p>Skills, structure, keywords, relevance.</p>
            </div>

            <div className="feature-card">
              <h3>3️⃣ Get Insights</h3>
              <p>ATS score, job match, suggestions.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= TESTIMONIALS ================= */}
      <section className="testimonials" id="testimonials">
        <div className="container">
          <h2 className="section-title">What Users Say</h2>

          <div className="feature-grid">
            <div className="feature-card">
              <p>“Got shortlisted within a week!”</p>
              <h4>– Ananya Sharma</h4>
            </div>

            <div className="feature-card">
              <p>“Job match score is very accurate.”</p>
              <h4>– Rohan Mehta</h4>
            </div>

            <div className="feature-card">
              <p>“Clean UI and instant results.”</p>
              <h4>– Priya Verma</h4>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="footer">
        <div className="footer-inner">
          <div>📞 +91 9876543210</div>
          <div>✉️ support@airesume.com</div>
          <div>© 2025 AI Resume Analyzer</div>
        </div>
      </footer>
    </main>
  );
}
