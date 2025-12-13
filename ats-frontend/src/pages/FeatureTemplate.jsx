import "./feature.css";

export default function FeatureTemplate({ title, icon, description }) {
  return (
    <div className="feature-page-wrapper fade-in">
      <div className="feature-content slide-up">
        <div className="feature-icon">{icon}</div>

        <h1 className="feature-title">{title}</h1>

        <p className="feature-description">{description}</p>

        <a href="/upload" className="feature-button">Try This Feature →</a>
      </div>
    </div>
  );
}
