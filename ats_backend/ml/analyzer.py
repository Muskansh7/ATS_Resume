import re
from fastapi.concurrency import run_in_threadpool
from ats_backend.ml.embeddings import get_embeddings, cosine_similarity
from ats_backend.ml.skill_extractor import extract_skills
from ats_backend.ml.role_profiles import get_missing_skills


# ---------------- SIMILARITY ---------------- #

def similarity(text_a: str, text_b: str) -> float:
    if not text_a or not text_b:
        return 0.0
    emb = get_embeddings([text_a, text_b])
    return cosine_similarity(emb[0], emb[1])


# ---------------- WEAKNESS ANALYSIS ---------------- #

def analyze_weaknesses(resume_text: str, resume_skills: list):
    weaknesses = []
    text = resume_text.lower()
    words = resume_text.split()

    if len(words) < 200:
        weaknesses.append("Resume content is too short")

    if not re.search(r"\d+%|\d+\s?(years|yrs|projects|clients|users)", text):
        weaknesses.append("Lack of quantified achievements")

    if len(resume_skills) < 5:
        weaknesses.append("Limited number of technical skills detected")

    if "experience" not in text:
        weaknesses.append("Experience section is missing or unclear")

    if "project" not in text:
        weaknesses.append("Projects section is missing or weak")

    if not weaknesses:
        weaknesses.append("No major weaknesses detected")

    return weaknesses


# ---------------- SUGGESTIONS ---------------- #

def generate_suggestions(weaknesses: list):
    suggestions = []

    for w in weaknesses:
        lw = w.lower()

        if "short" in lw:
            suggestions.append(
                "Add more detailed descriptions of your projects and work experience"
            )

        if "quantified" in lw:
            suggestions.append(
                "Include measurable results such as numbers, percentages, or impact"
            )

        if "technical skills" in lw:
            suggestions.append(
                "Add more role-relevant technical skills aligned with the job description"
            )

        if "experience section" in lw:
            suggestions.append(
                "Clearly structure your experience section with roles and responsibilities"
            )

        if "projects section" in lw:
            suggestions.append(
                "Add 2–3 real projects demonstrating practical application of your skills"
            )

    if not suggestions:
        suggestions.append("Minor refinements can further strengthen your resume")

    return suggestions


# ---------------- CORE ANALYSIS (SYNC) ---------------- #

def _analyze_resume_sync(resume_text: str, job_title: str, job_description: str):
    resume_text = resume_text or ""
    job_text = ((job_title or "") + " " + (job_description or "")).strip()

    resume_skills = extract_skills(resume_text)
    jd_skills = extract_skills(job_description or "")

    match_score = round(similarity(resume_text, job_text) * 100, 2) if job_text else 0

    overlap = len(
        set(map(str.lower, resume_skills)) &
        set(map(str.lower, jd_skills))
    )

    coverage = (overlap / len(jd_skills)) if jd_skills else 0
    ats_score = min(100, round(0.65 * match_score + 35 * coverage, 2))

    missing_skills = get_missing_skills(resume_skills, job_role=job_title)

    weaknesses = analyze_weaknesses(resume_text, resume_skills)
    suggestions = generate_suggestions(weaknesses)

    skill_score = min(100, len(resume_skills) * 8)

    content_score = (
        60 if len(resume_text.split()) > 400 else
        40 if len(resume_text.split()) > 250 else
        20
    )

    structure_score = (
        60 if all(k in resume_text.lower() for k in ["experience", "skills", "education"])
        else 35
    )

    tone_score = (
        60 if re.search(r"\b(led|managed|improved|developed|designed|built)\b", resume_text.lower())
        else 35
    )

    return {
        "resumeText": resume_text,
        "matchScore": match_score,
        "atsScore": ats_score,
        "skills": resume_skills,
        "requiredSkills": jd_skills,
        "missingSkills": missing_skills,
        "weaknesses": weaknesses,
        "suggestions": suggestions,
        "skillScore": skill_score,
        "contentScore": content_score,
        "structureScore": structure_score,
        "toneScore": tone_score,
    }


# ---------------- ASYNC ENTRY POINT ---------------- #

async def analyze_resume(resume_text: str, job_title: str = None, job_description: str = None):
    return await run_in_threadpool(
        _analyze_resume_sync,
        resume_text,
        job_title,
        job_description
    )
