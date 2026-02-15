# 🚀 Quick Start - NutriSense Backend

## ⚡ Super Fast Setup (5 minutes)

### Step 1: Create Virtual Environment
```bash
cd backend
python -m venv venv
```

### Step 2: Activate Virtual Environment

**Windows:**
```bash
venv\Scripts\activate
```

**Linux/Mac:**
```bash
source venv/bin/activate
```

You should see `(venv)` in your prompt ✅

### Step 3: Install Dependencies
```bash
pip install -r requirements.txt
```

### Step 4: Configure API Key
```bash
# Copy example file
copy .env.example .env     # Windows
cp .env.example .env       # Linux/Mac

# Edit .env and add:
GROQ_API_KEY=your_key_here
```

Get free key: https://console.groq.com/

### Step 5: Start Server
```bash
uvicorn app.main:app --reload
```

### Step 6: Test It
Open browser: http://localhost:8000/docs

---

## 🎯 Even Faster (Use Startup Script)

**Windows:**
```bash
cd backend
start.bat
```

**Linux/Mac:**
```bash
cd backend
chmod +x start.sh
./start.sh
```

Done! The script handles everything automatically.

---

## 🧪 Test Everything Works

In a new terminal (keep server running):

```bash
cd backend
source venv/bin/activate    # or venv\Scripts\activate
python test_api.py
```

Expected output:
```
✅ Health check passed
✅ Soil analysis passed
✅ Get history passed
✅ All tests completed!
```

---

## 📊 Try Your First API Call

### Using curl:
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
    "location": "Test Field"
  }'
```

### Using Python:
```python
import requests

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

### Using Swagger UI:
1. Go to http://localhost:8000/docs
2. Click on `POST /api/analyze`
3. Click "Try it out"
4. Use the example data
5. Click "Execute"

---

## 🎓 What You Get

✅ **10 API Endpoints** ready to use
✅ **Interactive documentation** at /docs
✅ **Soil health analysis** with 8 parameters
✅ **AI recommendations** (crops, fertilizer, irrigation)
✅ **History tracking** with SQLite database
✅ **CSV export** functionality

---

## 🔧 Common Commands

| Task | Command |
|------|---------|
| Activate venv | `source venv/bin/activate` (Linux/Mac)<br>`venv\Scripts\activate` (Windows) |
| Start server | `uvicorn app.main:app --reload` |
| Run tests | `python test_api.py` |
| View docs | Open http://localhost:8000/docs |
| Stop server | Press `Ctrl+C` |
| Deactivate venv | `deactivate` |

---

## 🆘 Troubleshooting

### "python: command not found"
Use `python3` instead of `python` (Linux/Mac)

### "Module not found"
Make sure venv is activated (you should see `(venv)` in prompt)

### "GROQ_API_KEY not configured"
Edit `.env` file and add your API key

### "Port already in use"
Change port: `uvicorn app.main:app --reload --port 8001`

### "Permission denied" (Linux/Mac)
```bash
chmod +x start.sh
```

---

## 📚 Next Steps

1. ✅ **Read the docs:** Check SETUP_GUIDE.md for details
2. ✅ **Test all endpoints:** Run test_api.py
3. ✅ **Explore API:** Use Swagger UI at /docs
4. ✅ **Build frontend:** Use API to create React app
5. ✅ **Deploy:** Follow DEPLOYMENT_CHECKLIST.md

---

## 💡 Pro Tips

- **Always activate venv** before working
- **Use the startup scripts** for convenience
- **Check /docs** for interactive API testing
- **Run tests** after making changes
- **Keep .env file secret** (never commit it)

---

## 🎉 You're Ready!

Your FastAPI backend is now running with:
- ✅ Virtual environment isolation
- ✅ All dependencies installed
- ✅ Database initialized
- ✅ API documentation available
- ✅ Ready for frontend integration

**API Docs:** http://localhost:8000/docs
**Health Check:** http://localhost:8000/health

Happy coding! 🚀
