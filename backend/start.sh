#!/bin/bash

# NutriSense Backend Quick Start Script

echo "🌱 NutriSense Backend - Quick Start"
echo "===================================="
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  No .env file found. Creating from example..."
    cp .env.example .env
    echo "✅ Created .env file"
    echo "⚠️  Please edit .env and add your GROQ_API_KEY"
    echo ""
fi

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python -m venv venv
    echo "✅ Virtual environment created"
    echo ""
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "📥 Installing dependencies..."
pip install -r requirements.txt

echo ""
echo "✅ Setup complete!"
echo ""
echo "🚀 Starting server..."
echo "📖 API Docs will be available at: http://localhost:8000/docs"
echo ""

# Start server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
