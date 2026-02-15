"""
Configuration Management
Extracted from old backend.py - environment variables and settings
"""

import os
from typing import Optional
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings with environment variable support"""
    
    # API Configuration
    GROQ_API_KEY: Optional[str] = None
    
    # Database Configuration
    DATABASE_URL: str = "sqlite:///./data/soil_history.db"
    
    # Environment
    ENVIRONMENT: str = "development"
    
    # API Settings
    API_V1_PREFIX: str = "/api"
    PROJECT_NAME: str = "NutriSense API"
    VERSION: str = "1.0.0"
    
    # CORS Settings
    CORS_ORIGINS: str = "http://localhost:3000,http://localhost:5173,http://127.0.0.1:3000,http://127.0.0.1:5173"
    
    @property
    def cors_origins_list(self) -> list[str]:
        """Parse CORS origins from comma-separated string"""
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",")]
    
    # AI Model Configuration
    DEFAULT_AI_MODEL: str = "llama-3.3-70b-versatile"
    AI_TEMPERATURE: float = 0.3
    AI_MAX_TOKENS: int = 600
    AI_TIMEOUT: int = 30
    
    # Optimal Parameter Ranges (from old app.py interpretation logic)
    OPTIMAL_RANGES: dict = {
        "pH": {"min": 6.5, "max": 7.5, "unit": "pH"},
        "EC": {"min": 0.0, "max": 0.8, "unit": "dS/m"},
        "Moisture": {"min": 25.0, "max": 40.0, "unit": "%"},
        "Nitrogen": {"min": 40.0, "max": 80.0, "unit": "mg/kg"},
        "Phosphorus": {"min": 20.0, "max": 50.0, "unit": "mg/kg"},
        "Potassium": {"min": 100.0, "max": 250.0, "unit": "mg/kg"},
        "Microbial": {"min": 3.0, "max": 7.0, "unit": "Index"},
        "Temperature": {"min": 10.0, "max": 30.0, "unit": "°C"},
    }
    
    class Config:
        env_file = ".env"
        case_sensitive = True


# Global settings instance
settings = Settings()


def is_production_environment() -> bool:
    """Check if running in production environment"""
    return settings.ENVIRONMENT.lower() == "production"


def get_groq_api_key() -> Optional[str]:
    """Get Groq API key from settings or environment"""
    return settings.GROQ_API_KEY or os.getenv("GROQ_API_KEY")
