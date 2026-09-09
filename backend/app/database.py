from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Hum SQLite use kar rahe hain prototype ke liye
SQLALCHEMY_DATABASE_URL = "sqlite:///./land_records.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Yeh function har API request ko database connection dega
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()