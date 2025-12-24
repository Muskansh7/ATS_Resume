import React, { useState } from "react";
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
      setError("Please choose a resume file (PDF, DOCX or TXT).");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("resume", file);
      fd.append("job_title", jobTitle || "");
      fd.append("job_description", jobDescription || "");

      const res = await axios.post("http://127.0.0.1:8000/analyze", fd, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 120000,
      });

      // store response in sessionStorage (fallback if navigation state lost)
      sessionStorage.setItem("lastAnalysis", JSON.stringify(res.data));

      // navigate with state for immediate rendering
      nav("/result", { state: { data: res.data } });
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.detail || "Server or network error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-page">
      <form className="upload-card" onSubmit={handleSubmit}>
        <h2>Upload Resume</h2>
        <input placeholder="Job Title" value={jobTitle} onChange={e=>setJobTitle(e.target.value)} />
        <textarea placeholder="Job Description" value={jobDescription} onChange={e=>setJobDescription(e.target.value)} />
        <label className="filebox">
          <input type="file" accept=".pdf,.docx,.txt" onChange={(e)=>setFile(e.target.files?.[0])} />
        </label>

        {error && <div className="error">{error}</div>}
        <button className="primary" type="submit" disabled={loading}>
          {loading ? "Analyzing…" : "Analyze Resume"}
        </button>
      </form>
    </div>
  );
};

export default Upload;
