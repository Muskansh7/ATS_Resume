# ats_backend/models.py

from sqlalchemy import Column, Integer, String
from ats_backend.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, nullable=True)
    email = Column(String, unique=True, index=True, nullable=False)
    phone = Column(String, nullable=True)
    user_id = Column(String, unique=True, nullable=True)
    password_hash = Column(String, nullable=False)
