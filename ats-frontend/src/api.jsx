const API = import.meta.env.VITE_API_URL || "http://localhost:8000";

export async function getJobs() {
  try {
    const res = await fetch(`${API}/jobs`);
    if (!res.ok) throw new Error("Failed to fetch jobs");
    return await res.json();
  } catch (e) {
    // fallback mock if backend not running
    return [
      { id: "1", title: "Frontend Engineer", location: "Remote", desc: "Build UI" },
      { id: "2", title: "ML Engineer", location: "Bangalore", desc: "Work on embeddings" }
    ];
  }
}

export async function getJob(id) {
  try {
    const res = await fetch(`${API}/jobs/${id}`);
    if (!res.ok) throw new Error("Failed");
    return await res.json();
  } catch (e) {
    return { id, title: id==='1'?"Frontend Engineer":"ML Engineer", location: "Remote", desc: "Sample job description" };
  }
}

export async function applyJob(jobId, formData, onProgress) {
  // POST multipart FormData to backend: /jobs/:id/apply
  const url = `${API}/jobs/${jobId}/apply`;
  // use fetch; note: fetch doesn't support progress events on request body.
  // If you have to show upload progress, use xhr in the frontend & backend that accepts streaming.
  const res = await fetch(url, { method: "POST", body: formData });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(txt || "Upload failed");
  }
  return await res.json();
}
