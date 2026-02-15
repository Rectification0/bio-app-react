"""
API Testing Script
Quick tests to verify all endpoints are working
"""

import requests
import json
from datetime import datetime

BASE_URL = "http://localhost:8000"

# Sample soil data
SAMPLE_SOIL_DATA = {
    "pH": 7.0,
    "EC": 1.5,
    "Moisture": 30.0,
    "Nitrogen": 60.0,
    "Phosphorus": 35.0,
    "Potassium": 180.0,
    "Microbial": 5.5,
    "Temperature": 25.0
}


def test_health_check():
    """Test health check endpoint"""
    print("\n🔍 Testing Health Check...")
    response = requests.get(f"{BASE_URL}/health")
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    assert response.status_code == 200
    print("✅ Health check passed")


def test_analyze_soil():
    """Test soil analysis endpoint"""
    print("\n🔍 Testing Soil Analysis...")
    response = requests.post(
        f"{BASE_URL}/api/analyze",
        json={
            "soil_data": SAMPLE_SOIL_DATA,
            "location": "Test Field",
            "save_to_history": True
        }
    )
    print(f"Status: {response.status_code}")
    result = response.json()
    print(f"Health Score: {result['health_score']}")
    print(f"Parameters analyzed: {len(result['parameters'])}")
    
    # Check each parameter
    for param, data in result['parameters'].items():
        print(f"  {param}: {data['value']} {data['unit']} - {data['status']} {data['emoji']}")
    
    assert response.status_code == 200
    assert 0 <= result['health_score'] <= 100
    assert len(result['parameters']) == 8
    print("✅ Soil analysis passed")
    return result


def test_health_summary():
    """Test AI health summary endpoint"""
    print("\n🔍 Testing AI Health Summary...")
    response = requests.post(
        f"{BASE_URL}/api/analyze/recommendations/health-summary",
        json={
            "soil_data": SAMPLE_SOIL_DATA,
            "location": "Test Field"
        }
    )
    print(f"Status: {response.status_code}")
    
    if response.status_code == 200:
        result = response.json()
        print(f"Recommendation Type: {result['recommendation_type']}")
        print(f"Model Used: {result['model_used']}")
        print(f"Content Preview: {result['content'][:200]}...")
        print("✅ Health summary passed")
    else:
        print(f"⚠️  AI service not configured or error: {response.json()}")


def test_crop_recommendations():
    """Test AI crop recommendations endpoint"""
    print("\n🔍 Testing Crop Recommendations...")
    response = requests.post(
        f"{BASE_URL}/api/analyze/recommendations/crops",
        json={
            "soil_data": SAMPLE_SOIL_DATA,
            "location": "Test Field"
        }
    )
    print(f"Status: {response.status_code}")
    
    if response.status_code == 200:
        result = response.json()
        print(f"Content Preview: {result['content'][:200]}...")
        print("✅ Crop recommendations passed")
    else:
        print(f"⚠️  AI service not configured or error: {response.json()}")


def test_fertilizer_plan():
    """Test AI fertilizer plan endpoint"""
    print("\n🔍 Testing Fertilizer Plan...")
    response = requests.post(
        f"{BASE_URL}/api/analyze/recommendations/fertilizer",
        json={
            "soil_data": SAMPLE_SOIL_DATA,
            "location": "Test Field"
        }
    )
    print(f"Status: {response.status_code}")
    
    if response.status_code == 200:
        result = response.json()
        print(f"Content Preview: {result['content'][:200]}...")
        print("✅ Fertilizer plan passed")
    else:
        print(f"⚠️  AI service not configured or error: {response.json()}")


def test_get_history():
    """Test get history endpoint"""
    print("\n🔍 Testing Get History...")
    response = requests.get(f"{BASE_URL}/api/history?limit=5")
    print(f"Status: {response.status_code}")
    result = response.json()
    print(f"Records found: {len(result)}")
    
    if result:
        print(f"Latest record:")
        print(f"  ID: {result[0]['id']}")
        print(f"  Location: {result[0]['location']}")
        print(f"  Health Score: {result[0]['health_score']}")
        print(f"  Timestamp: {result[0]['timestamp']}")
    
    assert response.status_code == 200
    print("✅ Get history passed")
    return result


def test_get_record_by_id(record_id):
    """Test get single record endpoint"""
    print(f"\n🔍 Testing Get Record by ID ({record_id})...")
    response = requests.get(f"{BASE_URL}/api/history/{record_id}")
    print(f"Status: {response.status_code}")
    
    if response.status_code == 200:
        result = response.json()
        print(f"Record ID: {result['id']}")
        print(f"Location: {result['location']}")
        print(f"Health Score: {result['health_score']}")
        print("✅ Get record by ID passed")
    else:
        print(f"⚠️  Record not found")


def test_history_count():
    """Test history count endpoint"""
    print("\n🔍 Testing History Count...")
    response = requests.get(f"{BASE_URL}/api/history/count")
    print(f"Status: {response.status_code}")
    result = response.json()
    print(f"Total records: {result['count']}")
    assert response.status_code == 200
    print("✅ History count passed")


def test_validation_errors():
    """Test input validation"""
    print("\n🔍 Testing Input Validation...")
    
    # Test invalid pH
    invalid_data = SAMPLE_SOIL_DATA.copy()
    invalid_data["pH"] = 15.0  # Out of range
    
    response = requests.post(
        f"{BASE_URL}/api/analyze",
        json={
            "soil_data": invalid_data,
            "location": "Test Field"
        }
    )
    print(f"Status for invalid pH: {response.status_code}")
    assert response.status_code == 422  # Validation error
    print("✅ Validation errors working correctly")


def run_all_tests():
    """Run all tests"""
    print("=" * 60)
    print("🧪 NutriSense API Test Suite")
    print("=" * 60)
    
    try:
        # Basic tests
        test_health_check()
        test_analyze_soil()
        test_validation_errors()
        
        # History tests
        history = test_get_history()
        test_history_count()
        
        if history:
            test_get_record_by_id(history[0]['id'])
        
        # AI tests (may fail if API key not configured)
        print("\n" + "=" * 60)
        print("🤖 AI Recommendation Tests (requires GROQ_API_KEY)")
        print("=" * 60)
        test_health_summary()
        test_crop_recommendations()
        test_fertilizer_plan()
        
        print("\n" + "=" * 60)
        print("✅ All tests completed!")
        print("=" * 60)
        
    except requests.exceptions.ConnectionError:
        print("\n❌ Error: Could not connect to API server")
        print("Make sure the server is running: uvicorn app.main:app --reload")
    except Exception as e:
        print(f"\n❌ Test failed: {str(e)}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    run_all_tests()
