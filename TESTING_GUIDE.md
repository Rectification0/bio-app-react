# Testing Guide

## Quick Start Testing

### 1. Start the API Server

```bash
cd backend
uvicorn app.main:app --reload
```

The server will start at `http://localhost:8000`

### 2. Run the Test Script

```bash
# In a new terminal
cd backend
python test_api.py
```

This will run a comprehensive test suite covering all endpoints.

### 3. Manual Testing with Swagger UI

Open your browser and go to: `http://localhost:8000/docs`

The interactive API documentation allows you to test all endpoints directly from your browser.

## Test Scenarios

### Scenario 1: Basic Soil Analysis

**Endpoint:** `POST /api/analyze`

**Test Data:**
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

**Expected Result:**
- Health score between 80-90
- All parameters interpreted correctly
- pH status: "Optimal" 🟢
- Record saved to database

### Scenario 2: Poor Soil Conditions

**Test Data:**
```json
{
  "soil_data": {
    "pH": 5.0,
    "EC": 3.5,
    "Moisture": 10.0,
    "Nitrogen": 20.0,
    "Phosphorus": 10.0,
    "Potassium": 50.0,
    "Microbial": 2.0,
    "Temperature": 35.0
  },
  "location": "South Field"
}
```

**Expected Result:**
- Health score below 50
- Multiple "Low" or "Critical" statuses
- pH status: "Acidic" 🔴
- EC status: "High" 🟠

### Scenario 3: Optimal Conditions

**Test Data:**
```json
{
  "soil_data": {
    "pH": 6.8,
    "EC": 0.5,
    "Moisture": 32.0,
    "Nitrogen": 65.0,
    "Phosphorus": 40.0,
    "Potassium": 200.0,
    "Microbial": 6.0,
    "Temperature": 22.0
  },
  "location": "East Field"
}
```

**Expected Result:**
- Health score above 90
- Most parameters "Optimal" 🟢
- High quality soil assessment

### Scenario 4: Input Validation

**Invalid pH (should fail):**
```json
{
  "soil_data": {
    "pH": 15.0,
    ...
  }
}
```

**Expected Result:**
- HTTP 422 Validation Error
- Error message: "pH must be between 0 and 14"

**Invalid Moisture (should fail):**
```json
{
  "soil_data": {
    "Moisture": 150.0,
    ...
  }
}
```

**Expected Result:**
- HTTP 422 Validation Error
- Error message: "Moisture must be between 0 and 100%"

## Testing AI Recommendations

### Prerequisites
- Set `GROQ_API_KEY` in your `.env` file
- Get a free API key from https://console.groq.com/

### Test Health Summary

**Endpoint:** `POST /api/analyze/recommendations/health-summary`

**Test Data:**
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
  "location": "Test Field",
  "model": "llama-3.3-70b-versatile"
}
```

**Expected Result:**
- AI-generated summary text
- Mentions overall condition
- Lists main concerns
- Provides top 3 actions

### Test Crop Recommendations

**Endpoint:** `POST /api/analyze/recommendations/crops`

**Expected Result:**
- List of 5 suitable crops
- Reasons for each crop
- Indian crop varieties mentioned

### Test Fertilizer Plan

**Endpoint:** `POST /api/analyze/recommendations/fertilizer`

**Expected Result:**
- NPK ratio recommendations
- kg/hectare amounts
- Application timing
- Organic alternatives

## Testing History Endpoints

### Get History

**Endpoint:** `GET /api/history?limit=10&location=North`

**Expected Result:**
- List of up to 10 records
- Filtered by location (if provided)
- Ordered by timestamp (newest first)

### Get Single Record

**Endpoint:** `GET /api/history/1`

**Expected Result:**
- Full record details
- All soil parameters
- Health score
- Timestamp and location

### Delete Record

**Endpoint:** `DELETE /api/history/1`

**Expected Result:**
- Success message
- Record removed from database

### Export History

**Endpoint:** `POST /api/history/export?limit=100`

**Expected Result:**
- CSV file download
- Contains all record data
- Proper headers

## Performance Testing

### Load Test with curl

```bash
# Test 100 requests
for i in {1..100}; do
  curl -X POST http://localhost:8000/api/analyze \
    -H "Content-Type: application/json" \
    -d '{"soil_data": {...}}' &
done
wait
```

### Expected Performance

- Analysis endpoint: < 100ms
- AI endpoints: 1-3 seconds (depends on Groq API)
- History queries: < 50ms
- Database operations: < 20ms

## Automated Testing with pytest

### Create test file: `backend/tests/test_api.py`

```python
import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] in ["healthy", "degraded"]

def test_analyze_soil():
    response = client.post("/api/analyze", json={
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
    })
    assert response.status_code == 200
    data = response.json()
    assert 0 <= data["health_score"] <= 100
    assert len(data["parameters"]) == 8

def test_invalid_ph():
    response = client.post("/api/analyze", json={
        "soil_data": {
            "pH": 15.0,  # Invalid
            "EC": 1.5,
            "Moisture": 30.0,
            "Nitrogen": 60.0,
            "Phosphorus": 35.0,
            "Potassium": 180.0,
            "Microbial": 5.5,
            "Temperature": 25.0
        }
    })
    assert response.status_code == 422
```

### Run pytest

```bash
cd backend
pytest tests/ -v
```

## Troubleshooting Tests

### "Connection refused"
- Make sure the API server is running
- Check the port (default: 8000)

### "GROQ_API_KEY not configured"
- Create `.env` file in backend directory
- Add your API key: `GROQ_API_KEY=your_key_here`

### "Database locked"
- Close any other connections to the database
- Restart the API server

### "Validation error"
- Check that all required fields are present
- Verify data types match the schema
- Check value ranges (pH: 0-14, Moisture: 0-100, etc.)

## Test Coverage

The test suite covers:

- ✅ Health check endpoint
- ✅ Soil analysis with all parameters
- ✅ Parameter interpretation (all 8 parameters)
- ✅ Health score calculation
- ✅ Input validation (all validators)
- ✅ Database operations (CRUD)
- ✅ History queries with filters
- ✅ CSV export
- ✅ AI recommendations (all types)
- ✅ Error handling
- ✅ CORS configuration

## Next Steps

1. **Add more test cases** for edge cases
2. **Set up CI/CD** to run tests automatically
3. **Add integration tests** with real database
4. **Add performance benchmarks**
5. **Test with production data**
