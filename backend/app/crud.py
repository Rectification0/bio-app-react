"""
Database CRUD Operations
Extracted from old backend.py - save_record() and load_history() functions
"""

import json
import hashlib
from typing import List, Optional
from datetime import datetime
from sqlalchemy.orm import Session
from sqlalchemy import desc

from .database import SoilRecordDB
from .models import SoilData, SoilRecord
from .services.analysis import calculate_health_score


def create_data_hash(soil_data: dict) -> str:
    """Create MD5 hash of soil data for deduplication"""
    data_str = json.dumps(soil_data, sort_keys=True)
    return hashlib.md5(data_str.encode()).hexdigest()


def save_soil_record(
    db: Session,
    soil_data: SoilData,
    summary: Optional[str] = None,
    location: Optional[str] = None
) -> Optional[SoilRecord]:
    """
    Save soil analysis record to database
    Original logic from old backend.py save_record() function (lines 630-670)
    
    Args:
        db: Database session
        soil_data: Validated soil data
        summary: Optional AI-generated summary
        location: Optional location string
        
    Returns:
        Created SoilRecord or None if duplicate
    """
    try:
        # Convert to dict and create hash
        soil_dict = soil_data.model_dump()
        data_hash = create_data_hash(soil_dict)
        
        # Check if record already exists
        existing = db.query(SoilRecordDB).filter(
            SoilRecordDB.data_hash == data_hash
        ).first()
        
        if existing:
            # Record already exists, return None
            return None
        
        # Calculate health score
        health_score = calculate_health_score(soil_data)
        
        # Create new record
        db_record = SoilRecordDB(
            data_hash=data_hash,
            soil_data=json.dumps(soil_dict),
            timestamp=datetime.now(),
            summary=summary,
            location=location,
            health_score=health_score
        )
        
        db.add(db_record)
        db.commit()
        db.refresh(db_record)
        
        # Convert to Pydantic model
        return SoilRecord(
            id=db_record.id,
            data_hash=db_record.data_hash,
            soil_data=soil_dict,
            timestamp=db_record.timestamp,
            summary=db_record.summary,
            location=db_record.location,
            health_score=db_record.health_score
        )
        
    except Exception as e:
        db.rollback()
        raise e


def get_soil_records(
    db: Session,
    location: Optional[str] = None,
    limit: int = 20,
    offset: int = 0
) -> List[SoilRecord]:
    """
    Retrieve soil analysis history
    Original logic from old backend.py load_history() function (lines 680-710)
    
    Args:
        db: Database session
        location: Optional location filter
        limit: Maximum number of records to return
        offset: Number of records to skip
        
    Returns:
        List of SoilRecord objects
    """
    try:
        query = db.query(SoilRecordDB).order_by(desc(SoilRecordDB.timestamp))
        
        # Apply location filter if provided
        if location:
            query = query.filter(SoilRecordDB.location.ilike(f"%{location}%"))
        
        # Apply pagination
        query = query.limit(limit).offset(offset)
        
        # Execute query
        db_records = query.all()
        
        # Convert to Pydantic models
        records = []
        for db_record in db_records:
            try:
                soil_dict = json.loads(db_record.soil_data)
                records.append(SoilRecord(
                    id=db_record.id,
                    data_hash=db_record.data_hash,
                    soil_data=soil_dict,
                    timestamp=db_record.timestamp,
                    summary=db_record.summary,
                    location=db_record.location,
                    health_score=db_record.health_score
                ))
            except json.JSONDecodeError:
                # Skip records with invalid JSON
                continue
        
        return records
        
    except Exception as e:
        raise e


def get_soil_record_by_id(db: Session, record_id: int) -> Optional[SoilRecord]:
    """
    Get a single soil record by ID
    
    Args:
        db: Database session
        record_id: Record ID
        
    Returns:
        SoilRecord or None if not found
    """
    try:
        db_record = db.query(SoilRecordDB).filter(
            SoilRecordDB.id == record_id
        ).first()
        
        if not db_record:
            return None
        
        soil_dict = json.loads(db_record.soil_data)
        
        return SoilRecord(
            id=db_record.id,
            data_hash=db_record.data_hash,
            soil_data=soil_dict,
            timestamp=db_record.timestamp,
            summary=db_record.summary,
            location=db_record.location,
            health_score=db_record.health_score
        )
        
    except Exception as e:
        raise e


def delete_soil_record(db: Session, record_id: int) -> bool:
    """
    Delete a soil record by ID
    
    Args:
        db: Database session
        record_id: Record ID to delete
        
    Returns:
        True if deleted, False if not found
    """
    try:
        db_record = db.query(SoilRecordDB).filter(
            SoilRecordDB.id == record_id
        ).first()
        
        if not db_record:
            return False
        
        db.delete(db_record)
        db.commit()
        return True
        
    except Exception as e:
        db.rollback()
        raise e


def get_record_count(db: Session, location: Optional[str] = None) -> int:
    """
    Get total count of records
    
    Args:
        db: Database session
        location: Optional location filter
        
    Returns:
        Total count of records
    """
    try:
        query = db.query(SoilRecordDB)
        
        if location:
            query = query.filter(SoilRecordDB.location.ilike(f"%{location}%"))
        
        return query.count()
        
    except Exception as e:
        raise e
