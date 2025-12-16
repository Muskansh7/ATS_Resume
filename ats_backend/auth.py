import os
from datetime import datetime, timedelta

from jose import jwt
from passlib.hash import bcrypt
from fastapi import HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# JWT settings
SECRET = os.getenv("JWT_SECRET", "secret123")
ALGO = os.getenv("JWT_ALGO", "HS256")
EXPIRE_MIN = int(os.getenv("TOKEN_EXPIRE_MINUTES", "4320"))

# OAuth2 scheme
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")


# =========================
# Password helpers
# =========================
def hash_password(password: str) -> str:
    password = password[:72]  # bcrypt limit
    return bcrypt.hash(password)


def verify_password(password: str, hashed: str) -> bool:
    password = password[:72]
    return bcrypt.verify(password, hashed)


# =========================
# JWT helpers
# =========================
def create_token(data: dict) -> str:
    expire = datetime.utcnow() + timedelta(minutes=EXPIRE_MIN)
    payload = {
        **data,
        "exp": expire
    }
    return jwt.encode(payload, SECRET, algorithm=ALGO)


def verify_token(token: str) -> dict:
    try:
        return jwt.decode(token, SECRET, algorithms=[ALGO])
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )
