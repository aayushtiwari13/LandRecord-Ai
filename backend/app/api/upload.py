import os
import uuid
from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.document import Document
from app.models.user import User
from app.api.deps import get_current_user

from app.models.document import DocumentStatus  
from app.core.ai import extract_land_record_data 

router = APIRouter(prefix="/upload", tags=["Document Upload"])

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/")
async def upload_document(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)  # <-- API Secure ho gayi!
):
    allowed_extensions = [".pdf", ".png", ".jpg", ".jpeg"]
    file_ext = os.path.splitext(file.filename)[1].lower()
    
    if file_ext not in allowed_extensions:
        raise HTTPException(status_code=400, detail="Only PDF or Image files are allowed")

    unique_filename = f"{uuid.uuid4()}{file_ext}"
    file_path = os.path.join(UPLOAD_DIR, unique_filename)

    # 1. File ko local folder mein save karein
    with open(file_path, "wb") as buffer:
        content = await file.read()
        buffer.write(content)
        
    # 2. File ki details Database mein save karein (Logged-in User ki ID ke saath)
    new_doc = Document(
        original_filename=file.filename,
        saved_filename=unique_filename,
        file_path=file_path,
        owner_id=current_user.id
    )
    db.add(new_doc)
    db.commit()
    db.refresh(new_doc)

    return {
        "message": "File successfully uploaded and linked to your account!",
        "document_id": new_doc.id,
        "owner_name": current_user.name
    }

@router.get("/my-documents")
def get_my_documents(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Database se sirf current user ke documents nikalna
    documents = db.query(Document).filter(Document.owner_id == current_user.id).all()
    
    if not documents:
        return {"message": "You haven't uploaded any documents yet.", "documents": []}
    
    return {"documents": documents}

@router.post("/{document_id}/extract")
def extract_document_data(
    document_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Check karein ki document exist karta hai aur isi user ka hai
    document = db.query(Document).filter(
        Document.id == document_id, 
        Document.owner_id == current_user.id
    ).first()
    
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
        
    # AI Logic Run karein
    extracted_data = extract_land_record_data(document.file_path)
    
    # Agar error na ho, toh status PROCESSED mark kar dein
    if "error" not in extracted_data:
        document.status = DocumentStatus.PROCESSED
        db.commit()
        
    return {
        "message": "AI Extraction Complete",
        "document_id": document.id,
        "extracted_info": extracted_data
    }