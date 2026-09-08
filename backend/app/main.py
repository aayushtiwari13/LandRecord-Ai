from fastapi import FastAPI
from app.database import Base, engine
from app.models import user,document
from app.api import auth, upload  # Naya router import kiya

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Land Record AI API")

# Router ko app mein add karna
app.include_router(auth.router)
app.include_router(upload.router)
@app.get("/")
def root():
    return {"message": "Land Record AI Backend is running!"}

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