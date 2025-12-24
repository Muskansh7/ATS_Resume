import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";
import "./Upload.css";

const Upload = () => {
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setError("Please choose a resume file (PDF or TXT).");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("resume", file);
      formData.append("job_title", jobTitle);
      formData.append("job_description", jobDescription);

      const res = await axios.post(
        `${API_BASE_URL}/analyze`,
        formData,
        {
          headers: {
            "Accept": "application/json",
          },
          timeout: 120000,
        }
      );

      // Save response (fallback)
      sessionStorage.setItem("lastAnalysis", JSON.stringify(res.data));

      // Navigate to result page
      navigate("/result", { state: { data: res.data } });

    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.detail ||
        "Could not connect to server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-page">
      <form className="upload-card" onSubmit={handleSubmit}>
        <h2>Upload Resume</h2>

        <input
          placeholder="Job Title"
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
        />

        <textarea
          placeholder="Job Description"
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
        />

        <label className="filebox">
          <input
            type="file"
            accept=".pdf,.txt"
            onChange={(e) => setFile(e.target.files?.[0])}
          />
        </label>

        {error && <div className="error">{error}</div>}

        <button type="submit" className="primary" disabled={loading}>
          {loading ? "Analyzing…" : "Analyze Resume"}
        </button>
      </form>
    </div>
  );
};

export default Upload;
