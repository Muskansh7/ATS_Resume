# ats_backend/ml/analyzer.py
from .embeddings import get_embeddings, cosine_similarity
from .skill_extractor import extract_skills
import numpy as np

def similarity(text_a: str, text_b: str) -> float:
    if not text_a or not text_b:
        return 0.0
    emb_a = get_embeddings(text_a)
    emb_b = get_embeddings(text_b)
    return cosine_similarity(emb_a, emb_b)

def analyze_resume(resume_text: str, job_title: str, job_description: str):
    # -----------------------------
    # CLEAN DEFAULTS
    # -----------------------------
    resume_text = resume_text or ""
    job_text = (job_title or "") + " " + (job_description or "")

    # -----------------------------
    # SKILL EXTRACTION
    # -----------------------------
    resume_skills = extract_skills(resume_text)
    jd_skills = extract_skills(job_description)

    # -----------------------------
    # MATCH SCORE (semantic similarity)
    # -----------------------------
    match = similarity(resume_text, job_text) * 100
    match_score = round(match, 2)

    # -----------------------------
    # ATS SCORE (coverage + semantic)
    # -----------------------------
    skill_coverage = 0.0
    if jd_skills:
        skill_coverage = len(
            set([s.lower() for s in resume_skills]) &
            set([s.lower() for s in jd_skills])
        ) / len(jd_skills)

    ats_score = min(100, round(0.6 * match_score + 40 * skill_coverage, 2))

    # -----------------------------
    # SUB SCORES
    # -----------------------------
    tone_score = round(min(100, match_score * 0.6 + 10), 2)
    content_score = round(min(100, match_score * 0.7 + len(resume_skills)), 2)
    structure_score = 70
    skills_score = round(min(100, len(resume_skills) * 8), 2)

    # -----------------------------
    # MISSING SKILLS
    # -----------------------------
    missing = [
        s for s in jd_skills
        if s.lower() not in [x.lower() for x in resume_skills]
    ]

    # -----------------------------
    # DYNAMIC WEAKNESS & SUGGESTION SYSTEM
    # -----------------------------
    weaknesses = []
    suggestions = []
    text_lower = resume_text.lower()

    # 1. Too few skills
    if len(resume_skills) < 6:
        weaknesses.append("Resume contains too few technical skills.")
        suggestions.append("Add more relevant technical skills to strengthen your resume.")

    # 2. Experience missing
    if "experience" not in text_lower and "work" not in text_lower:
        weaknesses.append("Work experience section seems missing or unclear.")
        suggestions.append("Include a clearly labeled work experience section.")

    # 3. No measurable achievements
    if "%" not in resume_text and "increased" not in text_lower and "reduced" not in text_lower:
        weaknesses.append("Resume lacks measurable achievements.")
        suggestions.append("Add quantified results, such as 'Improved accuracy by 20%'.")

    # 4. No project section
    if "project" not in text_lower:
        weaknesses.append("Project section not found.")
        suggestions.append("Add academic or personal projects to showcase hands-on work.")

    # 5. Resume length issues
    word_count = len(resume_text.split())
    if word_count < 150:
        weaknesses.append("Resume appears too short.")
        suggestions.append("Add more achievements, responsibilities, and skills.")

    if word_count > 900:
        weaknesses.append("Resume appears too long.")
        suggestions.append("Shorten by removing irrelevant details.")

    # 6. Missing job-specific skills
    if missing:
        weaknesses.append("Some required job-specific skills are missing.")
        suggestions.append(f"Add missing required skills: {', '.join(missing[:8])}.")

    # 7. Missing common sections
    sections = ["education", "experience", "projects", "skills", "certifications"]
    missing_sections = [s for s in sections if s not in text_lower]

    if missing_sections:
        weaknesses.append(f"Missing important resume sections: {', '.join(missing_sections)}.")
        suggestions.append("Add the missing sections to improve completeness.")

    # 8. Low match score
    if match_score < 35:
        weaknesses.append("Resume does not align well with the job description.")
        suggestions.append("Revise content to better match job requirements.")

    # Fallbacks
    if not weaknesses:
        weaknesses.append("Resume is well-structured with no major weaknesses detected.")

    if not suggestions:
        suggestions.append("Resume is strong; consider polishing formatting and clarity.")

    # -----------------------------
    # RETURN RESPONSE
    # -----------------------------
    return {
        "resumeText": resume_text,
        "skills": resume_skills,
        "requiredSkills": jd_skills,
        "missingSkills": missing,
        "matchScore": match_score,
        "atsScore": ats_score,
        "toneScore": tone_score,
        "contentScore": content_score,
        "structureScore": structure_score,
        "skillScore": skills_score,
        "keywordMatch": len(
            set([s.lower() for s in resume_skills]) &
            set([s.lower() for s in jd_skills])
        ),
        "weaknesses": weaknesses,
        "suggestions": suggestions,
    }
