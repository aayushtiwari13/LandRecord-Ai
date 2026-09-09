import enum
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

# File ka status track karne ke liye
class DocumentStatus(str, enum.Enum):
    PENDING = "PENDING"       # Upload ho gayi, AI processing baaki hai
    PROCESSED = "PROCESSED"   # AI ne data extract kar liya
    FAILED = "FAILED"         # AI extraction fail ho gaya

class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)
    original_filename = Column(String, nullable=False)
    saved_filename = Column(String, unique=True, nullable=False)
    file_path = Column(String, nullable=False)
    upload_date = Column(DateTime, default=datetime.utcnow)
    status = Column(Enum(DocumentStatus), default=DocumentStatus.PENDING)
    
    # Kis user ne upload kiya uska relation (User Table se connect hoga)
    owner_id = Column(Integer, ForeignKey("users.id"))