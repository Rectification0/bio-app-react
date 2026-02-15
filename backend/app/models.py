"""
Pydantic Models
Extracted from old backend.py - SoilData class with all validators
"""

from typing import Optional, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field, field_validator


class SoilData(BaseModel):
    """
    Soil analysis data model with validation
    Original from old backend.py lines 200-220
    """
    pH: float = Field(..., description="Soil pH level (0-14)")
    EC: float = Field(..., description="Electrical Conductivity in dS/m")
    Moisture: float = Field(..., description="Moisture content in %")
    Nitrogen: float = Field(..., description="Available Nitrogen in mg/kg")
    Phosphorus: float = Field(..., description="Available Phosphorus in mg/kg")
    Potassium: float = Field(..., description="Available Potassium in mg/kg")
    Microbial: float = Field(..., description="Microbial Activity Index (0-10)")
    Temperature: float = Field(..., description="Soil Temperature in °C")
    
    @field_validator('pH')
    @classmethod
    def pH_range(cls, v: float) -> float:
        """Validate pH is within valid range"""
        if not 0 <= v <= 14:
            raise ValueError('pH must be between 0 and 14')
        return v
    
    @field_validator('EC')
    @classmethod
    def ec_range(cls, v: float) -> float:
        """Validate EC is non-negative"""
        if v < 0:
            raise ValueError('EC cannot be negative')
        return v
    
    @field_validator('Moisture')
    @classmethod
    def moisture_range(cls, v: float) -> float:
        """Validate moisture is within valid range"""
        if not 0 <= v <= 100:
            raise ValueError('Moisture must be between 0 and 100%')
        return v
    
    @field_validator('Nitrogen', 'Phosphorus', 'Potassium')
    @classmethod
    def nutrient_range(cls, v: float) -> float:
        """Validate nutrients are non-negative"""
        if v < 0:
            raise ValueError('Nutrient values cannot be negative')
        return v
    
    @field_validator('Microbial')
    @classmethod
    def microbial_range(cls, v: float) -> float:
        """Validate microbial index is within valid range"""
        if not 0 <= v <= 10:
            raise ValueError('Microbial index must be between 0 and 10')
        return v
    
    @field_validator('Temperature')
    @classmethod
    def temperature_range(cls, v: float) -> float:
        """Validate temperature is reasonable"""
        if not -10 <= v <= 60:
            raise ValueError('Temperature must be between -10 and 60°C')
        return v


class ParameterInterpretation(BaseModel):
    """Interpretation result for a single parameter"""
    value: float
    status: str  # "Optimal", "Low", "High", "Critical", etc.
    emoji: str
    unit: str


class AnalysisResult(BaseModel):
    """Complete soil analysis result"""
    health_score: float
    parameters: Dict[str, ParameterInterpretation]
    timestamp: datetime
    location: Optional[str] = None


class AIRecommendation(BaseModel):
    """AI-generated recommendation"""
    recommendation_type: str  # "summary", "crops", "fertilizer"
    content: str
    model_used: str
    timestamp: datetime


class SoilRecord(BaseModel):
    """Database record for soil analysis"""
    id: Optional[int] = None
    data_hash: str
    soil_data: Dict[str, Any]
    timestamp: datetime
    summary: Optional[str] = None
    location: Optional[str] = None
    health_score: float
    
    class Config:
        from_attributes = True


class AnalysisRequest(BaseModel):
    """Request model for soil analysis"""
    soil_data: SoilData
    location: Optional[str] = None
    save_to_history: bool = True


class RecommendationRequest(BaseModel):
    """Request model for AI recommendations"""
    soil_data: SoilData
    location: Optional[str] = None
    model: Optional[str] = None  # AI model to use


class HistoryQuery(BaseModel):
    """Query parameters for history endpoint"""
    location: Optional[str] = None
    limit: int = Field(default=20, le=100)
    offset: int = Field(default=0, ge=0)


class ErrorResponse(BaseModel):
    """Standard error response"""
    error: str
    detail: Optional[str] = None
    timestamp: datetime = Field(default_factory=datetime.now)
