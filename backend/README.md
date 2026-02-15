# NutriSense Backend API

FastAPI backend for NutriSense - AI Soil Intelligence Platform

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Configure Environment

```bash
cp .env.example .env
# Edit .env and add your GROQ_API_KEY
```

### 3. Run the Server

```bash
# Development mode with auto-reload
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Or using Python
python -m app.main
```

### 4. Access API Documentation

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc
- Health Check: http://localhost:8000/health

## 📁 Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                 # FastAPI app initialization
│   ├── config.py               # Environment configuration
│   ├── models.py               # Pydantic models
│   ├── database.py             # SQLAlchemy setup
│   ├── crud.py                 # Database operations
│   │
│   ├── services/
│   │   ├── __init__.py
│   │   ├── analysis.py         # Soil analysis logic
│   │   └── ai.py               # Groq AI integration
│   │
│   └── routers/
│       ├── __init__.py
│       ├── analyze.py          # Analysis endpoints
│       └── history.py          # History CRUD endpoints
│
├── requirements.txt
├── .env.example
└── README.md
```

## 🔌 API Endpoints

### Analysis Endpoints

#### POST /api/analyze
Analyze soil data and return health score with parameter interpretations.

**Request Body:**
```json
{
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
  "location": "North Field",
  "save_to_history": true
}
```

**Response:**
```json
{
  "health_score": 85.5,
  "parameters": {
    "pH": {
      "value": 7.0,
      "status": "Optimal",
      "emoji": "🟢",
      "unit": "pH"
    },
    ...
  },
  "timestamp": "2026-02-14T18:00:00",
  "location": "North Field"
}
```

#### POST /api/analyze/recommendations/health-summary
Get AI-generated health summary and recommendations.

**Request Body:**
```json
{
  "soil_data": { ... },
  "location": "North Field",
  "model": "llama-3.3-70b-versatile"
}
```

**Response:**
```json
{
  "recommendation_type": "summary",
  "content": "Your soil is in good condition with optimal pH...",
  "model_used": "llama-3.3-70b-versatile",
  "timestamp": "2026-02-14T18:00:00"
}
```

#### POST /api/analyze/recommendations/crops
Get AI-generated crop recommendations.

#### POST /api/analyze/recommendations/fertilizer
Get AI-generated fertilizer plan.

#### POST /api/analyze/recommendations/irrigation
Get AI-generated irrigation recommendations.

### History Endpoints

#### GET /api/history
Get soil analysis history with optional filtering.

**Query Parameters:**
- `location` (optional): Filter by location
- `limit` (default: 20, max: 100): Maximum records to return
- `offset` (default: 0): Pagination offset

**Response:**
```json
[
  {
    "id": 1,
    "data_hash": "abc123...",
    "soil_data": { ... },
    "timestamp": "2026-02-14T18:00:00",
    "summary": "AI summary...",
    "location": "North Field",
    "health_score": 85.5
  },
  ...
]
```

#### GET /api/history/{id}
Get a single soil analysis record by ID.

#### DELETE /api/history/{id}
Delete a soil analysis record.

#### POST /api/history/export
Export history as CSV file.

**Query Parameters:**
- `location` (optional): Filter by location
- `limit` (default: 100, max: 1000): Maximum records to export

## 🧪 Testing the API

### Using curl

```bash
# Health check
curl http://localhost:8000/health

# Analyze soil data
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
    "location": "Test Field"
  }'

# Get history
curl http://localhost:8000/api/history?limit=10
```

### Using Python

```python
import requests

# Analyze soil
response = requests.post(
    "http://localhost:8000/api/analyze",
    json={
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
        "location": "Test Field"
    }
)
print(response.json())
```

## 🔧 Configuration

### Environment Variables

All configuration is managed through environment variables (see `.env.example`):

- `GROQ_API_KEY`: Your Groq API key (required for AI features)
- `DATABASE_URL`: SQLite database path
- `ENVIRONMENT`: `development` or `production`
- `DEFAULT_AI_MODEL`: AI model to use (default: llama-3.3-70b-versatile)

### Available AI Models

- `llama-3.3-70b-versatile` - Best quality (default)
- `llama-3.1-8b-instant` - Fast responses
- `mixtral-8x7b-32768` - Balanced performance
- `gemma2-9b-it` - Efficient and accurate

## 🗄️ Database

The application uses SQLite by default with the following schema:

```sql
CREATE TABLE soil_records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    data_hash TEXT UNIQUE,
    soil_data TEXT,  -- JSON
    timestamp DATETIME,
    summary TEXT,
    location TEXT,
    health_score REAL
);
```

The database is automatically created on first run at `backend/app/data/soil_history.db`.

### Database Migration

The current schema is compatible with the existing Streamlit app database. If you have an existing database, simply point `DATABASE_URL` to it.

## 🔒 Security Notes

1. **API Keys**: Never commit `.env` file with real API keys
2. **CORS**: Update `CORS_ORIGINS` in production to match your frontend domain
3. **Rate Limiting**: Consider adding rate limiting for production use
4. **Input Validation**: All inputs are validated using Pydantic models

## 🐛 Troubleshooting

### "GROQ_API_KEY not configured"
- Make sure you've created a `.env` file with your API key
- Get a free API key from https://console.groq.com/

### Database errors
- Check that the `data/` directory is writable
- Verify `DATABASE_URL` path is correct

### Import errors
- Make sure you're running from the `backend/` directory
- Verify all dependencies are installed: `pip install -r requirements.txt`

## 📝 Migration Notes

### Changes from Streamlit App

1. **Removed Dependencies:**
   - All Streamlit imports removed
   - No `st.` function calls
   - Pure Python business logic

2. **Preserved Logic:**
   - Exact same health score calculation formula
   - Same parameter interpretation ranges
   - Same AI prompts and behavior
   - Compatible database schema

3. **New Features:**
   - RESTful API endpoints
   - Async/await support
   - Proper error handling with HTTPException
   - Request/response validation with Pydantic
   - CORS support for React frontend
   - CSV export functionality

4. **Breaking Changes:**
   - None - API is backward compatible with existing database

## 🚀 Production Deployment

### Using Docker (recommended)

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app/ ./app/

ENV ENVIRONMENT=production

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Using systemd

Create `/etc/systemd/system/nutrisense.service`:

```ini
[Unit]
Description=NutriSense API
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/opt/nutrisense/backend
Environment="PATH=/opt/nutrisense/venv/bin"
ExecStart=/opt/nutrisense/venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8000
Restart=always

[Install]
WantedBy=multi-user.target
```

## 📄 License

Part of NutriSense - AI Soil Intelligence Platform
