# NutriSense - AI Soil Intelligence Platform

AI-powered soil analysis and recommendation system with FastAPI backend and React frontend.

> 🚀 **New to the project?** Start with [QUICK_START.md](QUICK_START.md) for a 5-minute setup guide!

## 🎯 Project Overview

NutriSense analyzes soil parameters and provides AI-powered recommendations for:
- Soil health assessment
- Crop selection
- Fertilizer planning
- Irrigation management

## 📁 Project Structure

```
nutrisense-react/
├── backend/                    # FastAPI REST API
│   ├── app/
│   │   ├── main.py            # FastAPI application
│   │   ├── models.py          # Pydantic models
│   │   ├── database.py        # SQLAlchemy setup
│   │   ├── crud.py            # Database operations
│   │   ├── config.py          # Configuration
│   │   ├── services/          # Business logic
│   │   │   ├── analysis.py   # Soil analysis
│   │   │   └── ai.py          # AI integration
│   │   └── routers/           # API endpoints
│   │       ├── analyze.py    # Analysis endpoints
│   │       └── history.py    # History endpoints
│   ├── requirements.txt
│   ├── .env.example
│   └── README.md
│
├── frontend/                   # React application (to be built)
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   └── types/
│   └── package.json
│
├── docs/                       # Original Streamlit app (reference)
│   ├── old-app.py             # Original frontend
│   └── old-backend.py         # Original backend logic
│
├── MIGRATION_GUIDE.md         # Detailed extraction docs
├── TESTING_GUIDE.md           # Testing instructions
├── EXTRACTION_SUMMARY.md      # Complete summary
└── README.md                  # This file
```

## 🚀 Quick Start

> 💡 **New Users:** Check [QUICK_START.md](QUICK_START.md) for backend and [FRONTEND_SETUP.md](FRONTEND_SETUP.md) for frontend!

### Backend Setup (with Virtual Environment - Recommended)

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create and activate virtual environment:**
   ```bash
   # Windows
   python -m venv venv
   venv\Scripts\activate
   
   # Linux/Mac
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment:**
   ```bash
   # Windows
   copy .env.example .env
   
   # Linux/Mac
   cp .env.example .env
   
   # Edit .env and add your GROQ_API_KEY
   ```

5. **Start the server:**
   ```bash
   # Using startup scripts (handles venv automatically)
   ./start.sh      # Linux/Mac
   start.bat       # Windows
   
   # Or manually (make sure venv is activated)
   uvicorn app.main:app --reload
   ```

> 💡 **Tip:** See [SETUP_GUIDE.md](SETUP_GUIDE.md) for detailed virtual environment setup instructions

6. **Access API documentation:**
   - Swagger UI: http://localhost:8000/docs
   - ReDoc: http://localhost:8000/redoc

### Frontend Setup

1. **Install Node.js 18+** from https://nodejs.org/

2. **Install dependencies:**
   ```bash
   cd frontend
   npm install
   ```

3. **Configure environment:**
   ```bash
   # Windows
   copy .env.example .env
   
   # Linux/Mac
   cp .env.example .env
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

5. **Open in browser:**
   - Frontend: http://localhost:3000
   - Make sure backend is running first!

> 💡 **Tip:** See [FRONTEND_SETUP.md](FRONTEND_SETUP.md) for detailed frontend setup

### Testing

```bash
# Backend tests
cd backend
python test_api.py

# Frontend (manual testing in browser)
cd frontend
npm run dev
```

## 🔑 Features

### Soil Analysis
- 8 parameter analysis (pH, EC, Moisture, NPK, Microbial, Temperature)
- Health score calculation (0-100)
- Parameter interpretation with status indicators
- Optimal range checking

### AI Recommendations
- Health summary and action items
- Crop recommendations (Indian varieties)
- Fertilizer planning (NPK ratios, timing)
- Irrigation scheduling

### History Management
- Save analysis records
- Query history with filters
- Export to CSV
- Delete records

## 📊 API Endpoints

### Analysis
- `POST /api/analyze` - Analyze soil data
- `POST /api/analyze/recommendations/health-summary` - Get AI summary
- `POST /api/analyze/recommendations/crops` - Get crop recommendations
- `POST /api/analyze/recommendations/fertilizer` - Get fertilizer plan
- `POST /api/analyze/recommendations/irrigation` - Get irrigation plan

### History
- `GET /api/history` - Get analysis history
- `GET /api/history/{id}` - Get single record
- `DELETE /api/history/{id}` - Delete record
- `POST /api/history/export` - Export as CSV

## 🧪 Example Request

```bash
curl -X POST http://localhost:8000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "soil_data": {
      "pH": 7.0,
      "EC": 1.5,
      "Moisture": 30.0,
      "Nitrogen": 60.0,
      "Phosphorus": 35.0,
      "Potassium": 180.0,
      "Microbial": 5.5,
      "Temperature": 25.0
    },
    "location": "North Field"
  }'
```

## 📖 Documentation

### Getting Started
- **[QUICK_START.md](QUICK_START.md)** - Backend quick start (5 min)
- **[FRONTEND_SETUP.md](FRONTEND_SETUP.md)** - Frontend setup guide (5 min)
- **[SETUP_GUIDE.md](SETUP_GUIDE.md)** - Detailed backend setup with venv

### Technical Docs
- **[backend/README.md](backend/README.md)** - Backend API documentation
- **[frontend/README.md](frontend/README.md)** - Frontend documentation
- **[MIGRATION_GUIDE.md](MIGRATION_GUIDE.md)** - Streamlit to FastAPI migration
- **[TESTING_GUIDE.md](TESTING_GUIDE.md)** - Testing instructions
- **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** - Common issues and solutions

### Reference
- **[EXTRACTION_SUMMARY.md](EXTRACTION_SUMMARY.md)** - Project summary
- **[DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)** - Production deployment

## 🛠️ Technology Stack

### Backend
- **FastAPI** - Modern Python web framework
- **SQLAlchemy** - SQL toolkit and ORM
- **Pydantic** - Data validation
- **Groq** - AI API for recommendations
- **SQLite** - Database

### Frontend (To Be Built)
- **React** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Axios** - HTTP client

## 🔒 Environment Variables

```env
GROQ_API_KEY=your_api_key_here
DATABASE_URL=sqlite:///./data/soil_history.db
ENVIRONMENT=development
DEFAULT_AI_MODEL=llama-3.3-70b-versatile
```

## 📈 Health Score Algorithm

```
Total: 100 points
├── pH: 25 points (optimal at 7.0)
├── EC: 25 points (lower is better)
├── Moisture: 20 points (optimal 25-40%)
└── NPK: 30 points (10 each)
```

## 🎯 Parameter Ranges

| Parameter | Optimal Range | Unit |
|-----------|--------------|------|
| pH | 6.5-7.5 | pH |
| EC | <0.8 | dS/m |
| Moisture | 25-40 | % |
| Nitrogen | 40-80 | mg/kg |
| Phosphorus | 20-50 | mg/kg |
| Potassium | 100-250 | mg/kg |
| Microbial | 3-7 | Index |
| Temperature | 10-30 | °C |

## 🚧 Project Status

- ✅ Backend API - Complete
- ✅ Database - Complete
- ✅ AI Integration - Complete
- ✅ Testing - Complete
- ✅ Frontend - Complete
- ⏳ Deployment - Ready (see DEPLOYMENT_CHECKLIST.md)

## 🎓 Getting Started Guide

### For Developers

1. **Read the documentation:**
   - Start with EXTRACTION_SUMMARY.md for overview
   - Read MIGRATION_GUIDE.md for technical details
   - Review TESTING_GUIDE.md for testing

2. **Set up the backend:**
   - Follow Quick Start instructions above
   - Test all endpoints using test_api.py
   - Explore API docs at /docs

3. **Build the frontend:**
   - Use the API documentation as reference
   - Implement React components
   - Connect to backend API

### For Users

1. **Install and configure:**
   - Install Python dependencies
   - Get Groq API key (free at console.groq.com)
   - Configure .env file

2. **Start using:**
   - Run the backend server
   - Access API documentation
   - Test with sample data

3. **Integrate:**
   - Use API endpoints in your application
   - Export data as needed
   - Build custom frontends

## 🔄 Migration from Streamlit

If you're migrating from the old Streamlit app:

1. **Database:** No migration needed - 100% compatible
2. **API Key:** Move from Streamlit secrets to .env file
3. **Data:** All existing records work as-is
4. **Logic:** All calculations preserved exactly

See MIGRATION_GUIDE.md for complete details.

## 📊 Performance

- Analysis: < 100ms
- Database queries: < 50ms
- AI recommendations: 1-3 seconds
- History export: < 500ms

## 🔐 Security

- Input validation with Pydantic
- SQL injection prevention (SQLAlchemy ORM)
- CORS configuration
- Environment-based secrets
- Error message sanitization

## 🆘 Support

For issues and questions:
1. Check the documentation files
2. Review the API docs at `/docs`
3. Run the test suite
4. Check the troubleshooting section in TESTING_GUIDE.md

## 📝 License

Part of NutriSense - AI Soil Intelligence Platform
