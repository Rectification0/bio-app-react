"""
FastAPI Main Application
NutriSense - AI Soil Intelligence Platform Backend
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from datetime import datetime

from .config import settings
from .routers import analyze_router, history_router


# Create FastAPI app
app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="AI-powered soil analysis and recommendation API",
    docs_url="/docs",
    redoc_url="/redoc"
)


# CORS middleware for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Include routers
app.include_router(analyze_router, prefix=settings.API_V1_PREFIX)
app.include_router(history_router, prefix=settings.API_V1_PREFIX)


# Root endpoint
@app.get("/")
async def root():
    """API root endpoint with service information"""
    return {
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "status": "online",
        "timestamp": datetime.now().isoformat(),
        "docs": "/docs",
        "endpoints": {
            "analysis": f"{settings.API_V1_PREFIX}/analyze",
            "history": f"{settings.API_V1_PREFIX}/history"
        }
    }


# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint for monitoring"""
    from .services.ai import get_groq_client
    from .database import engine
    
    # Check database connection
    db_status = "healthy"
    try:
        engine.connect()
    except Exception:
        db_status = "unhealthy"
    
    # Check AI service
    ai_status = "configured" if get_groq_client() else "not_configured"
    
    return {
        "status": "healthy" if db_status == "healthy" else "degraded",
        "timestamp": datetime.now().isoformat(),
        "services": {
            "database": db_status,
            "ai_service": ai_status
        }
    }


# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    """Handle unexpected exceptions"""
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal server error",
            "detail": str(exc) if settings.ENVIRONMENT == "development" else "An unexpected error occurred",
            "timestamp": datetime.now().isoformat()
        }
    )


# Startup event
@app.on_event("startup")
async def startup_event():
    """Initialize services on startup"""
    print(f"🚀 {settings.PROJECT_NAME} v{settings.VERSION} starting...")
    print(f"📊 Environment: {settings.ENVIRONMENT}")
    print(f"🔗 API Docs: http://localhost:8000/docs")
    
    # Check AI service
    from .services.ai import get_groq_client
    if get_groq_client():
        print("✅ Groq AI service configured")
    else:
        print("⚠️  Groq AI service not configured (set GROQ_API_KEY)")


# Shutdown event
@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup on shutdown"""
    print(f"👋 {settings.PROJECT_NAME} shutting down...")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True if settings.ENVIRONMENT == "development" else False
    )
