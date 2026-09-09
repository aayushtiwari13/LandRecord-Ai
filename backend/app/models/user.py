import enum
from sqlalchemy import Column, Integer, String, DateTime, Enum
from datetime import datetime
from app.database import Base

class UserRole(str, enum.Enum):
    ADMIN = "ADMIN"
    VERIFIER = "VERIFIER"
    VIEWER = "VIEWER"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    role = Column(Enum(UserRole), default=UserRole.VIEWER, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)