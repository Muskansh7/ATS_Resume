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

  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [typing, setTyping] = useState(true);

  // Typing Animation
  useEffect(() => {
    let interval;

    if (typing) {
      interval = setInterval(() => {
        setDisplayedText((prev) => {
          const target = words[currentWordIndex];
          if (prev.length < target.length) {
            return target.substring(0, prev.length + 1);
          } else {
            setTyping(false);
            return prev;
          }
        });
      }, 70);
    } else {
      interval = setTimeout(() => {
        const erase = setInterval(() => {
          setDisplayedText((prev) => {
            if (prev.length > 0) {
              return prev.slice(0, -1);
            } else {
              clearInterval(erase);
              setTyping(true);
              setCurrentWordIndex((prev) => (prev + 1) % words.length);
              return "";
            }
          });
        }, 40);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [typing, currentWordIndex]);


  return (
    <div className="landing-wrapper">

      {/* Background Animated Blobs */}
      <div className="blob blob1"></div>
      <div className="blob blob2"></div>
      <div className="blob blob3"></div>

      {/* NAVBAR */}
      <nav className="navbar fade-in">
        <div className="logo">AI Resume Analyzer</div>
        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#testimonials">Testimonials</a>

          {/* Always force user to login before using tool */}
          <Link to="/login" className="nav-button">Try Now</Link>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="hero fade-in">
        <h1 className="hero-title slide-up">
          Transform Your Resume with <span className="highlight">AI</span>
        </h1>

        <p className="hero-typing slide-up">
          <span className="typing-text">{displayedText}</span>
          <span className="cursor">|</span>
        </p>

        <p className="hero-subtext slide-up">
          Get instant insights on skills, strengths, weaknesses, job match score, and resume improvements.
        </p>

        <Link to="/login" className="cta-button slide-up">
          Get Started →
        </Link>
      </section>

      {/* FEATURES SECTION */}
      <section className="features fade-in" id="features">
        <h2>Why Choose AI Resume Analyzer?</h2>
        
        <div className="feature-grid">

          <div className="feature-card slide-up">
            <h3>⚡ Instant Analysis</h3>
            <p>Upload your resume and get AI-powered insights in seconds.</p>
          </div>

          <div className="feature-card slide-up">
            <h3>🎯 Job Match Score</h3>
            <p>See how well your resume aligns with specific job roles.</p>
          </div>

          <div className="feature-card slide-up">
            <h3>📊 Skill Extraction</h3>
            <p>Automatically extract hard and soft skills from your resume.</p>
          </div>

          <div className="feature-card slide-up">
            <h3>🔍 Weakness Detection</h3>
            <p>Identify gaps, missing keywords, and ways to improve your resume.</p>
          </div>

        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="testimonials fade-in" id="testimonials">
        <h2>What Users Say</h2>

        <div className="testimonial-grid">
          <div className="testimonial-card slide-up">
            <p>“This tool helped me improve my resume and I got shortlisted within a week!”</p>
            <h4>– Ananya Sharma</h4>
          </div>

          <div className="testimonial-card slide-up">
            <p>“The AI job match score is insanely accurate. Highly recommended.”</p>
            <h4>– Rohan Mehta</h4>
          </div>

          <div className="testimonial-card slide-up">
            <p>“Amazing UI and instant results. This is the future of resume analysis.”</p>
            <h4>– Priya Verma</h4>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer fade-in">
        <div><strong>Contact:</strong> +91 9876543210</div>
        <div><strong>Email:</strong> support@airesume.com</div>
        <div><strong>Website:</strong> www.airesume-analyzer.com</div>
      </footer>

    </div>
  );
}
