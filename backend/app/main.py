from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import Base, engine
from app.api import auth, upload

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Land Record AI Backend")

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes ko clean prefix aur tags ke saath include karein
app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(upload.router, prefix="/upload", tags=["Upload & Process"])

@app.get("/")
def root():
    return {"message": "Land Record AI API is running!"}

# from fastapi import FastAPI
# from app.database import Base, engine
# from app.models import user

# # Automatically create tables in SQLite
# Base.metadata.create_all(bind=engine)

# app = FastAPI(title="Land Record AI API")

# @app.get("/")
# def root():
#     return {
#         "status": "online",
#         "service": "Land Record AI Backend",
#         "version": "1.0.0"
#     }