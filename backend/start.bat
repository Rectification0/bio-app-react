@echo off
REM NutriSense Backend Quick Start Script for Windows

echo 🌱 NutriSense Backend - Quick Start
echo ====================================
echo.

REM Check if .env exists
if not exist .env (
    echo ⚠️  No .env file found. Creating from example...
    copy .env.example .env
    echo ✅ Created .env file
    echo ⚠️  Please edit .env and add your GROQ_API_KEY
    echo.
)

REM Check if virtual environment exists
if not exist venv (
    echo 📦 Creating virtual environment...
    python -m venv venv
    echo ✅ Virtual environment created
    echo.
)

REM Activate virtual environment
echo 🔧 Activating virtual environment...
call venv\Scripts\activate.bat

REM Install dependencies
echo 📥 Installing dependencies...
pip install -r requirements.txt

echo.
echo ✅ Setup complete!
echo.
echo 🚀 Starting server...
echo 📖 API Docs will be available at: http://localhost:8000/docs
echo.

REM Start server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
