# ats_backend/ml/role_profile.py

# ---------------- NORMALIZATION ---------------- #

def normalize_skill(skill: str) -> str:
    if not skill:
        return ""

    s = skill.lower().strip()

    aliases = {
        "ml": "machine learning",
        "sklearn": "scikit-learn",
        "reactjs": "react",
        "nodejs": "node",
        "rest": "rest api",
        "c plus plus": "c++",
        "c sharp": "c#"
    }

    return aliases.get(s, s)


# ---------------- ROLE SKILL PROFILES ---------------- #

ROLE_SKILLS = {
    "machine learning engineer": {
        "python", "machine learning", "deep learning",
        "pytorch", "tensorflow", "numpy", "pandas",
        "scikit-learn", "sql"
    },
    "backend developer": {
        "python", "django", "fastapi",
        "sql", "rest api", "docker", "git"
    },
    "frontend developer": {
        "html", "css", "javascript",
        "react", "typescript"
    },
    "data analyst": {
        "sql", "python", "pandas",
        "numpy", "data analysis"
    }
}


# ---------------- MISSING SKILLS ---------------- #

def get_missing_skills(found_skills, job_role=None):
    """
    Returns missing skills based on:
    - Explicit job role (if provided)
    - Inferred role from resume skills (if job role missing)
    """

    # Normalize found skills
    found = {normalize_skill(s) for s in found_skills if s}

    # -------- CASE 1: JOB ROLE PROVIDED -------- #
    if job_role:
        role = job_role.lower().strip()
        expected = ROLE_SKILLS.get(role, set())
        return sorted(expected - found)

    # -------- CASE 2: INFER ROLE FROM RESUME -------- #
    inferred_expected = set()

    if found & {"machine learning", "deep learning", "pytorch", "tensorflow"}:
        inferred_expected |= ROLE_SKILLS["machine learning engineer"]

    if found & {"django", "fastapi", "rest api"}:
        inferred_expected |= ROLE_SKILLS["backend developer"]

    if found & {"react", "javascript", "css"}:
        inferred_expected |= ROLE_SKILLS["frontend developer"]

    if found & {"pandas", "numpy", "data analysis"}:
        inferred_expected |= ROLE_SKILLS["data analyst"]

    if not inferred_expected:
        return []

    return sorted(inferred_expected - found)
