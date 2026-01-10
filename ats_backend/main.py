# ats_backend/main.py

from fastapi import FastAPI, Depends, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from ats_backend.database import Base, engine, get_db
from ats_backend.models import User
from ats_backend.auth import hash_password, verify_password, create_token
from ats_backend.ml.analyzer import analyze_resume
from ats_backend.ml.file_reader import extract_text


# ===================== APP SETUP =====================

app = FastAPI(title="ATS Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # OK for demo / deployment
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)


# ===================== HEALTH =====================

@app.get("/")
def health():
    return {"status": "ATS Backend Running"}


# ===================== AUTH =====================

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


@app.post("/login")
def login(
    userIdOrEmail: str = Form(...),
    password: str = Form(...),
    db: Session = Depends(get_db),
):
    user = (
        db.query(User)
        .filter(
            (User.email == userIdOrEmail)
            | (User.user_id == userIdOrEmail)
        )
        .first()
    )

    if not user:
        raise HTTPException(status_code=400, detail="User not found")

    if not verify_password(password, user.password_hash):
        raise HTTPException(status_code=400, detail="Incorrect password")

    return {
        "token": create_token({"user_id": user.id}),
        "user": {
            "id": user.id,
            "email": user.email,
            "userId": user.user_id,
            "fullName": user.full_name,
        },
    }


# ===================== ANALYZE =====================

@app.post("/analyze")
async def analyze(
    resume: UploadFile = File(...),
    job_title: str = Form(None),
    job_description: str = Form(None),
):
    resume_text = extract_text(resume)

    if not resume_text or not resume_text.strip():
        raise HTTPException(
            status_code=400,
            detail="Could not extract text from resume"
        )

    # ✅ DO NOT await (function is sync)
    return analyze_resume(resume_text, job_title, job_description)
