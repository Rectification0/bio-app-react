"""
Analysis Endpoints
Soil analysis and AI recommendation endpoints
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime

from ..database import get_db
from ..models import (
    SoilData,
    AnalysisRequest,
    AnalysisResult,
    RecommendationRequest,
    AIRecommendation,
    ErrorResponse
)
from ..services.analysis import analyze_soil_data
from ..services.ai import generate_ai_recommendation
from ..crud import save_soil_record
from ..config import settings


router = APIRouter(prefix="/analyze", tags=["Analysis"])


@router.post("/", response_model=AnalysisResult)
async def analyze_soil(
    request: AnalysisRequest,
    db: Session = Depends(get_db)
):
    """
    Analyze soil data and return health score with parameter interpretations
    
    **Input:** SoilData with all 8 parameters (pH, EC, Moisture, N, P, K, Microbial, Temperature)
    
    **Output:** 
    - health_score: Overall soil health (0-100)
    - parameters: Interpretation of each parameter with status and emoji
    - timestamp: Analysis timestamp
    - location: Optional location string
    
    **Logic:** Uses analysis.py calculate_health_score() and interpret_parameter()
    """
    try:
        # Perform analysis
        result = analyze_soil_data(request.soil_data, request.location)
        
        # Save to history if requested
        if request.save_to_history:
            try:
                save_soil_record(
                    db=db,
                    soil_data=request.soil_data,
                    location=request.location
                )
            except Exception:
                # Don't fail the request if saving fails
                pass
        
        return AnalysisResult(**result)
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Analysis failed: {str(e)}"
        )


@router.post("/recommendations/health-summary", response_model=AIRecommendation)
async def get_health_summary(
    request: RecommendationRequest,
    db: Session = Depends(get_db)
):
    """
    Get AI-generated health summary and recommendations
    
    **Input:** SoilData
    
    **Output:** 
    - recommendation_type: "summary"
    - content: AI-generated summary text
    - model_used: AI model name
    - timestamp: Generation timestamp
    
    **Logic:** Calls Groq API with health summary prompt
    """
    try:
        # Generate recommendation
        content = generate_ai_recommendation(
            soil_data=request.soil_data,
            recommendation_type="summary",
            location=request.location,
            model=request.model
        )
        
        # Save to history with summary
        try:
            save_soil_record(
                db=db,
                soil_data=request.soil_data,
                summary=content,
                location=request.location
            )
        except Exception:
            pass
        
        return AIRecommendation(
            recommendation_type="summary",
            content=content,
            model_used=request.model or settings.DEFAULT_AI_MODEL,
            timestamp=datetime.now()
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate health summary: {str(e)}"
        )


@router.post("/recommendations/crops", response_model=AIRecommendation)
async def get_crop_recommendations(request: RecommendationRequest):
    """
    Get AI-generated crop recommendations
    
    **Input:** SoilData
    
    **Output:** 
    - recommendation_type: "crops"
    - content: List of recommended crops with reasoning
    - model_used: AI model name
    - timestamp: Generation timestamp
    
    **Logic:** Calls Groq API with crop recommendation prompt
    """
    try:
        content = generate_ai_recommendation(
            soil_data=request.soil_data,
            recommendation_type="crops",
            location=request.location,
            model=request.model
        )
        
        return AIRecommendation(
            recommendation_type="crops",
            content=content,
            model_used=request.model or settings.DEFAULT_AI_MODEL,
            timestamp=datetime.now()
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate crop recommendations: {str(e)}"
        )


@router.post("/recommendations/fertilizer", response_model=AIRecommendation)
async def get_fertilizer_plan(request: RecommendationRequest):
    """
    Get AI-generated fertilizer plan
    
    **Input:** SoilData
    
    **Output:** 
    - recommendation_type: "fertilizer"
    - content: Fertilizer recommendations with NPK ratios and timing
    - model_used: AI model name
    - timestamp: Generation timestamp
    
    **Logic:** Calls Groq API with fertilizer planning prompt
    """
    try:
        content = generate_ai_recommendation(
            soil_data=request.soil_data,
            recommendation_type="fertilizer",
            location=request.location,
            model=request.model
        )
        
        return AIRecommendation(
            recommendation_type="fertilizer",
            content=content,
            model_used=request.model or settings.DEFAULT_AI_MODEL,
            timestamp=datetime.now()
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate fertilizer plan: {str(e)}"
        )


@router.post("/recommendations/irrigation", response_model=AIRecommendation)
async def get_irrigation_plan(request: RecommendationRequest):
    """
    Get AI-generated irrigation recommendations
    
    **Input:** SoilData
    
    **Output:** 
    - recommendation_type: "irrigation"
    - content: Irrigation schedule and water management advice
    - model_used: AI model name
    - timestamp: Generation timestamp
    
    **Logic:** Calls Groq API with irrigation planning prompt
    """
    try:
        content = generate_ai_recommendation(
            soil_data=request.soil_data,
            recommendation_type="irrigation",
            location=request.location,
            model=request.model
        )
        
        return AIRecommendation(
            recommendation_type="irrigation",
            content=content,
            model_used=request.model or settings.DEFAULT_AI_MODEL,
            timestamp=datetime.now()
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate irrigation plan: {str(e)}"
        )
