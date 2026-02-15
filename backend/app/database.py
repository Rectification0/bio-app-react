"""
Database Configuration and Session Management
Extracted from old backend.py - SQLite setup with SQLAlchemy
"""

import os
from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from datetime import datetime
from typing import Generator

from .config import settings


# Create data directory if it doesn't exist
db_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'data')
os.makedirs(db_dir, exist_ok=True)

# Database URL - convert relative path to absolute
if settings.DATABASE_URL.startswith("sqlite:///./"):
    db_path = settings.DATABASE_URL.replace("sqlite:///./", "")
    absolute_db_path = os.path.join(db_dir, os.path.basename(db_path))
    DATABASE_URL = f"sqlite:///{absolute_db_path}"
else:
    DATABASE_URL = settings.DATABASE_URL

# Create engine
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {}
)

# Session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for models
Base = declarative_base()


class SoilRecordDB(Base):
    """
    SQLAlchemy model for soil_records table
    Matches schema from old backend.py init_db() function
    """
    __tablename__ = "soil_records"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    data_hash = Column(String, unique=True, index=True, nullable=False)
    soil_data = Column(Text, nullable=False)  # JSON string
    timestamp = Column(DateTime, default=datetime.now, nullable=False)
    summary = Column(Text, nullable=True)
    location = Column(String, nullable=True)
    health_score = Column(Float, nullable=True)


def init_database():
    """
    Initialize database tables
    Original logic from old backend.py init_db() function
    """
    Base.metadata.create_all(bind=engine)


def get_db() -> Generator[Session, None, None]:
    """
    Dependency for getting database session
    Use with FastAPI Depends()
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# Initialize database on import
init_database()
