import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getJob, applyJob } from "../api/api";

export default function JobDetail() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [file, setFile] = useState(null);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getJob(id).then(setJob).catch(() => {});
  }, [id]);

  async function onSubmit(e) {
    e.preventDefault();
    if (!file) return setMsg("Please choose a resume file");
    setLoading(true);
    setMsg("");
    const fd = new FormData();
    fd.append("name", name);
    fd.append("email", email);
    fd.append("resume", file);
    try {
      // applyJob expects backend endpoint to return JSON { success: true, applicationId: "..." }
      const res = await applyJob(id, fd);
      setMsg("Applied successfully 🎉");
      setName(""); setEmail(""); setFile(null);
    } catch (err) {
      setMsg("Failed to apply: " + (err.message || err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button className="back" onClick={() => history.back()}>← Back</button>
      {!job ? <p>Loading...</p> : (
        <div>
          <h1>{job.title}</h1>
          <p className="muted">{job.location}</p>
          <p>{job.desc}</p>

          <hr />

          <h2>Apply</h2>
          <form onSubmit={onSubmit} className="form">
            <label>
              Full name
              <input value={name} onChange={e => setName(e.target.value)} required />
            </label>
            <label>
              Email
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
            </label>
            <label>
              Resume (PDF or DOCX)
              <input type="file" accept=".pdf,.doc,.docx" onChange={e => setFile(e.target.files[0])} />
            </label>
            <div>
              <button className="btn" type="submit" disabled={loading}>{loading ? "Applying..." : "Apply"}</button>
            </div>
            {msg && <p className="msg">{msg}</p>}
          </form>
        </div>
      )}
    </div>
  );
}
