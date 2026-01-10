import os
from datetime import datetime, timedelta
from jose import jwt
from passlib.hash import bcrypt
from fastapi.security import OAuth2PasswordBearer
from fastapi import HTTPException, status
from dotenv import load_dotenv
from ats_backend.database import get_db


load_dotenv()

SECRET = os.getenv("JWT_SECRET", "secret123")
ALGO = os.getenv("JWT_ALGO", "HS256")
EXPIRE_MIN = int(os.getenv("TOKEN_EXPIRE_MINUTES", "4320"))

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")

def hash_password(password: str):
    password = password[:72]   # prevents bcrypt error
    return bcrypt.hash(password)

def verify_password(password: str, hashed: str):
    password = password[:72]
    return bcrypt.verify(password, hashed)


def create_token(data: dict):
    expire = datetime.utcnow() + timedelta(minutes=EXPIRE_MIN)
    to_encode = {"exp": expire, **data}
    return jwt.encode(to_encode, SECRET, algorithm=ALGO)

def verify_token(token: str):
    try:
        return jwt.decode(token, SECRET, algorithms=[ALGO])
    except:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token"
        )
