# ats_backend/main.py

import tempfile
from fastapi import FastAPI, Depends, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from PyPDF2 import PdfReader

# DB & auth
from database import Base, engine, get_db
from models import User
from auth import hash_password, verify_password, create_token

# ML
from ml.analyzer import analyze_resume

# --------------------------------------------------
# CREATE APP (FIRST!)
# --------------------------------------------------
app = FastAPI(
    title="ATS Resume Analyzer API",
    version="1.0.0"
)

# --------------------------------------------------
# CORS (Netlify + Local)
# --------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "https://*.netlify.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --------------------------------------------------
# DATABASE INIT
# --------------------------------------------------
Base.metadata.create_all(bind=engine)

# --------------------------------------------------
# UTILS
# --------------------------------------------------
def extract_text_simple(uploaded_file: UploadFile) -> str:
    ext = uploaded_file.filename.split(".")[-1].lower()

    with tempfile.NamedTemporaryFile(delete=False, suffix=f".{ext}") as tmp:
        tmp.write(uploaded_file.file.read())
        tmp_path = tmp.name

    if ext == "txt":
        with open(tmp_path, "r", encoding="utf-8", errors="ignore") as f:
            return f.read()

    if ext == "pdf":
        reader = PdfReader(tmp_path)
        text = ""
        for page in reader.pages:
            text += page.extract_text() or ""
        return text.strip()

    return "Unsupported file format. Use PDF or TXT."

# --------------------------------------------------
# HEALTH CHECK
# --------------------------------------------------
@app.get("/")
def root():
    return {"status": "Backend running"}

# --------------------------------------------------
# SIGNUP
# --------------------------------------------------
@app.post("/signup")
def signup(
    email: str = Form(...),
    password: str = Form(...),
    full_name: str = Form(None),
    phone: str = Form(None),
    user_id: str = Form(None),
    db: Session = Depends(get_db),
):
    if db.query(User).filter(User.email == email).first():
        raise HTTPException(status_code=400, detail="Email already exists")

    if user_id and db.query(User).filter(User.user_id == user_id).first():
        raise HTTPException(status_code=400, detail="User ID already exists")

    user = User(
        email=email,
        full_name=full_name,
        phone=phone,
        user_id=user_id,
        password_hash=hash_password(password),
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return {
        "message": "Signup successful",
        "user": {
            "id": user.id,
            "email": user.email,
            "userId": user.user_id,
            "fullName": user.full_name,
        },
    }

# --------------------------------------------------
# LOGIN
# --------------------------------------------------
@app.post("/login")
def login(
    userIdOrEmail: str = Form(...),
    password: str = Form(...),
    db: Session = Depends(get_db),
):
    user = (
        db.query(User)
        .filter((User.email == userIdOrEmail) | (User.user_id == userIdOrEmail))
        .first()
    )

    if not user:
        raise HTTPException(status_code=400, detail="User not found")

    if not verify_password(password, user.password_hash):
        raise HTTPException(status_code=400, detail="Incorrect password")

    token = create_token({"user_id": user.id})

    return {
        "token": token,
        "user": {
            "id": user.id,
            "email": user.email,
            "userId": user.user_id,
            "fullName": user.full_name,
        },
    }

# --------------------------------------------------
# ANALYZE
# --------------------------------------------------
@app.post("/analyze")
def analyze(
    resume: UploadFile = File(...),
    job_title: str = Form(...),
    job_description: str = Form(...),
    db: Session = Depends(get_db),
):
    text = extract_text_simple(resume)
    result = analyze_resume(text, job_title, job_description)
    return result
