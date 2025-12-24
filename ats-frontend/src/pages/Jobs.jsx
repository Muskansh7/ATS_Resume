import React, { useEffect, useState } from "react";
import { getJobs } from "../api/api";
import JobCard from "../components/JobCard";

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  useEffect(() => {
    let mounted = true;
    getJobs().then(d => mounted && setJobs(d)).catch(() => {});
    return () => (mounted = false);
  }, []);
  return (
    <div>
      <h1>Open Jobs</h1>
      <div className="grid">
        {jobs.map(j => <JobCard key={j.id} j={j} />)}
      </div>
    </div>
  );
}
