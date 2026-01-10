import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Upload.css";

const Upload = () => {
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const nav = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setError("Please upload your resume");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const fd = new FormData();
      fd.append("resume", file);
      fd.append("job_title", jobTitle);
      fd.append("job_description", jobDescription);

      const res = await axios.post(
        "http://127.0.0.1:8000/analyze",
        fd,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      nav("/result", { state: { data: res.data } });
    } catch (err) {
      setError("Analysis failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>Upload Resume</h1>
        <p className="subtitle">Analyze your resume instantly</p>

        <label>Job Title</label>
        <input
          type="text"
          placeholder="Enter job title"
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
        />

        <label>Job Description</label>
        <textarea
          placeholder="Paste job description"
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
        />

        <label>Resume</label>
        <input
          type="file"
          accept=".pdf,.docx,.txt"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />

        {error && <div className="error">{error}</div>}

        <button type="submit" disabled={loading}>
          {loading ? "Analyzing..." : "Analyze →"}
        </button>
      </form>
    </div>
  );
};

export default Upload;
