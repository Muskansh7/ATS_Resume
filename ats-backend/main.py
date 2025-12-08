from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
import os
from jobs_db import jobs, applications

app = FastAPI()

# Allow frontend to talk to backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.get("/jobs")
def get_jobs():
    return jobs

@app.get("/jobs/{job_id}")
def get_job(job_id: str):
    for job in jobs:
        if job["id"] == job_id:
            return job
    return {"error": "Job not found"}

@app.post("/jobs/{job_id}/apply")
async def apply_job(
    job_id: str,
    name: str = Form(...),
    email: str = Form(...),
    resume: UploadFile = File(...)
):
    # save resume file
    file_location = f"{UPLOAD_DIR}/{resume.filename}"
    with open(file_location, "wb") as f:
        f.write(await resume.read())

    # store fake application
    app_data = {
        "job_id": job_id,
        "name": name,
        "email": email,
        "resume_path": file_location
    }
    applications.append(app_data)

    return {
        "success": True,
        "message": "Application submitted",
        "application": app_data
    }
