"""
History Endpoints
CRUD operations for soil analysis history
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from typing import List, Optional
import csv
import io

from ..database import get_db
from ..models import SoilRecord, ErrorResponse
from ..crud import (
    get_soil_records,
    get_soil_record_by_id,
    delete_soil_record,
    get_record_count
)


router = APIRouter(prefix="/history", tags=["History"])


@router.get("/", response_model=List[SoilRecord])
async def get_history(
    location: Optional[str] = Query(None, description="Filter by location"),
    limit: int = Query(20, le=100, description="Maximum records to return"),
    offset: int = Query(0, ge=0, description="Number of records to skip"),
    db: Session = Depends(get_db)
):
    """
    Get soil analysis history
    
    **Query Parameters:**
    - location: Optional location filter (case-insensitive partial match)
    - limit: Maximum number of records (default 20, max 100)
    - offset: Pagination offset (default 0)
    
    **Output:** List of soil analysis records ordered by timestamp (newest first)
    
    **Logic:** Uses crud.get_soil_records() from old backend.py load_history()
    """
    try:
        records = get_soil_records(
            db=db,
            location=location,
            limit=limit,
            offset=offset
        )
        return records
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to retrieve history: {str(e)}"
        )


@router.get("/count")
async def get_history_count(
    location: Optional[str] = Query(None, description="Filter by location"),
    db: Session = Depends(get_db)
):
    """
    Get total count of records
    
    **Query Parameters:**
    - location: Optional location filter
    
    **Output:** {"count": int, "location": str or null}
    """
    try:
        count = get_record_count(db=db, location=location)
        return {
            "count": count,
            "location": location
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to count records: {str(e)}"
        )


@router.get("/{record_id}", response_model=SoilRecord)
async def get_record(
    record_id: int,
    db: Session = Depends(get_db)
):
    """
    Get a single soil analysis record by ID
    
    **Path Parameters:**
    - record_id: Database record ID
    
    **Output:** Full analysis record with all data
    
    **Logic:** Query database by ID
    """
    try:
        record = get_soil_record_by_id(db=db, record_id=record_id)
        
        if not record:
            raise HTTPException(
                status_code=404,
                detail=f"Record with ID {record_id} not found"
            )
        
        return record
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to retrieve record: {str(e)}"
        )


@router.delete("/{record_id}")
async def delete_record(
    record_id: int,
    db: Session = Depends(get_db)
):
    """
    Delete a soil analysis record
    
    **Path Parameters:**
    - record_id: Database record ID to delete
    
    **Output:** {"success": bool, "message": str, "record_id": int}
    
    **Logic:** Delete record from database
    """
    try:
        success = delete_soil_record(db=db, record_id=record_id)
        
        if not success:
            raise HTTPException(
                status_code=404,
                detail=f"Record with ID {record_id} not found"
            )
        
        return {
            "success": True,
            "message": f"Record {record_id} deleted successfully",
            "record_id": record_id
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to delete record: {str(e)}"
        )


@router.post("/export")
async def export_history(
    location: Optional[str] = Query(None, description="Filter by location"),
    limit: int = Query(100, le=1000, description="Maximum records to export"),
    db: Session = Depends(get_db)
):
    """
    Export soil analysis history as CSV
    
    **Query Parameters:**
    - location: Optional location filter
    - limit: Maximum records to export (default 100, max 1000)
    
    **Output:** CSV file download
    
    **Logic:** Convert history records to CSV format
    """
    try:
        # Get records
        records = get_soil_records(
            db=db,
            location=location,
            limit=limit,
            offset=0
        )
        
        if not records:
            raise HTTPException(
                status_code=404,
                detail="No records found to export"
            )
        
        # Create CSV in memory
        output = io.StringIO()
        writer = csv.writer(output)
        
        # Write header
        writer.writerow([
            "ID", "Timestamp", "Location", "Health Score",
            "pH", "EC", "Moisture", "Nitrogen", "Phosphorus", 
            "Potassium", "Microbial", "Temperature", "Summary"
        ])
        
        # Write data rows
        for record in records:
            soil = record.soil_data
            writer.writerow([
                record.id,
                record.timestamp.isoformat(),
                record.location or "",
                record.health_score,
                soil.get("pH", ""),
                soil.get("EC", ""),
                soil.get("Moisture", ""),
                soil.get("Nitrogen", ""),
                soil.get("Phosphorus", ""),
                soil.get("Potassium", ""),
                soil.get("Microbial", ""),
                soil.get("Temperature", ""),
                record.summary or ""
            ])
        
        # Prepare response
        output.seek(0)
        
        return StreamingResponse(
            iter([output.getvalue()]),
            media_type="text/csv",
            headers={
                "Content-Disposition": f"attachment; filename=soil_history_{location or 'all'}_{records[0].timestamp.strftime('%Y%m%d')}.csv"
            }
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to export history: {str(e)}"
        )
