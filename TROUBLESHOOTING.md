# Troubleshooting Guide

Common issues and solutions for NutriSense backend.

## ✅ Issue Fixed: CORS_ORIGINS Parsing Error

**Error Message:**
```
pydantic_settings.sources.SettingsError: error parsing value for field "CORS_ORIGINS" from source "DotEnvSettingsSource"
json.decoder.JSONDecodeError: Expecting value: line 1 column 1 (char 0)
```

**Solution:**
This has been fixed in the latest version. The `CORS_ORIGINS` is now a comma-separated string instead of a list.

**Your `.env` file should have:**
```env
CORS_ORIGINS=http://localhost:3000,http://localhost:5173
```

**Not:**
```env
CORS_ORIGINS=["http://localhost:3000", "http://localhost:5173"]
```

If you still see this error, make sure your `.env` file matches the format in `.env.example`.

---

## Common Issues

### 1. Module Not Found Errors

**Error:**
```
ModuleNotFoundError: No module named 'fastapi'
```

**Solution:**
Make sure your virtual environment is activated and dependencies are installed:

```bash
# Activate venv
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows

# Install dependencies
pip install -r requirements.txt
```

**Verify:**
```bash
pip list | grep fastapi
# Should show: fastapi==0.109.0
```

---

### 2. Virtual Environment Not Activating

**Error:**
Virtual environment doesn't activate or `(venv)` doesn't appear in prompt.

**Solution:**

**Windows (PowerShell):**
```powershell
# If you get execution policy error
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Then activate
venv\Scripts\Activate.ps1
```

**Windows (Command Prompt):**
```cmd
venv\Scripts\activate.bat
```

**Linux/Mac:**
```bash
source venv/bin/activate
```

**Verify:**
```bash
which python  # Linux/Mac - should show path in venv
where python  # Windows - should show path in venv
```

---

### 3. GROQ_API_KEY Not Configured

**Error:**
```
⚠️ Groq AI service not configured (set GROQ_API_KEY)
```

**Solution:**

1. Get a free API key from https://console.groq.com/
2. Add it to your `.env` file:

```env
GROQ_API_KEY=gsk_your_actual_key_here
```

3. Restart the server

**Verify:**
```bash
# Check if key is loaded
python -c "from app.config import get_groq_api_key; print('✅ API key configured' if get_groq_api_key() else '❌ No API key')"
```

---

### 4. Port Already in Use

**Error:**
```
OSError: [Errno 48] Address already in use
```

**Solution:**

**Option 1: Use a different port**
```bash
uvicorn app.main:app --reload --port 8001
```

**Option 2: Kill the process using port 8000**

**Windows:**
```cmd
netstat -ano | findstr :8000
taskkill /PID <PID> /F
```

**Linux/Mac:**
```bash
lsof -ti:8000 | xargs kill -9
```

---

### 5. Database Locked Error

**Error:**
```
sqlite3.OperationalError: database is locked
```

**Solution:**

1. Close any other connections to the database
2. Restart the server
3. If problem persists, check for zombie processes:

```bash
# Linux/Mac
ps aux | grep uvicorn
kill -9 <PID>

# Windows
tasklist | findstr python
taskkill /PID <PID> /F
```

---

### 6. Import Errors (Can't Find app Module)

**Error:**
```
ModuleNotFoundError: No module named 'app'
```

**Solution:**

Make sure you're running commands from the `backend` directory:

```bash
cd backend
uvicorn app.main:app --reload
```

**Not from the root directory:**
```bash
# ❌ Wrong
uvicorn backend.app.main:app --reload

# ✅ Correct
cd backend
uvicorn app.main:app --reload
```

---

### 7. Pydantic Validation Errors

**Error:**
```
pydantic_core._pydantic_core.ValidationError: 1 validation error for SoilData
pH
  Value error, pH must be between 0 and 14
```

**Solution:**

This is expected behavior - the API is validating your input. Check your request data:

```json
{
  "soil_data": {
    "pH": 7.0,        // Must be 0-14
    "EC": 1.5,        // Must be >= 0
    "Moisture": 30.0, // Must be 0-100
    "Nitrogen": 60.0, // Must be >= 0
    "Phosphorus": 35.0, // Must be >= 0
    "Potassium": 180.0, // Must be >= 0
    "Microbial": 5.5, // Must be 0-10
    "Temperature": 25.0 // Must be -10 to 60
  }
}
```

---

### 8. CORS Errors in Browser

**Error:**
```
Access to fetch at 'http://localhost:8000/api/analyze' from origin 'http://localhost:3000' 
has been blocked by CORS policy
```

**Solution:**

Add your frontend URL to CORS_ORIGINS in `.env`:

```env
CORS_ORIGINS=http://localhost:3000,http://localhost:5173,http://localhost:5174
```

Or update `backend/app/config.py` to add more origins.

Restart the server after changing.

---

### 9. Database File Not Found

**Error:**
```
sqlite3.OperationalError: unable to open database file
```

**Solution:**

The database directory is created automatically, but if you see this error:

```bash
cd backend/app
mkdir data
```

Or let the application create it on first run.

---

### 10. Test Script Fails

**Error:**
```
requests.exceptions.ConnectionError: Failed to establish a new connection
```

**Solution:**

Make sure the server is running before running tests:

**Terminal 1:**
```bash
cd backend
source venv/bin/activate
uvicorn app.main:app --reload
```

**Terminal 2:**
```bash
cd backend
source venv/bin/activate
python test_api.py
```

---

### 11. Slow AI Responses

**Issue:**
AI endpoints take 10+ seconds to respond.

**Solution:**

This is normal for the first request (cold start). Subsequent requests should be faster.

To use a faster model, update `.env`:

```env
DEFAULT_AI_MODEL=llama-3.1-8b-instant
```

Models by speed:
- `llama-3.1-8b-instant` - Fastest
- `gemma2-9b-it` - Fast
- `mixtral-8x7b-32768` - Medium
- `llama-3.3-70b-versatile` - Slowest but best quality

---

### 12. Python Version Issues

**Error:**
```
SyntaxError: invalid syntax
```

**Solution:**

Make sure you're using Python 3.11 or higher:

```bash
python --version
# Should show: Python 3.11.x or higher
```

If you have multiple Python versions:

```bash
# Use specific version
python3.11 -m venv venv
```

---

### 13. Windows Path Issues

**Error:**
```
FileNotFoundError: [Errno 2] No such file or directory: './data/soil_history.db'
```

**Solution:**

This is handled automatically by the code, but if you see this:

1. Make sure you're in the `backend` directory
2. The path uses forward slashes even on Windows (this is correct)
3. Let the application create the directory on first run

---

### 14. Uvicorn Not Found

**Error:**
```
'uvicorn' is not recognized as an internal or external command
```

**Solution:**

Make sure venv is activated and uvicorn is installed:

```bash
# Activate venv
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows

# Install uvicorn
pip install uvicorn[standard]

# Or reinstall all dependencies
pip install -r requirements.txt
```

---

### 15. JSON Decode Error in Responses

**Error:**
```
json.decoder.JSONDecodeError: Expecting value
```

**Solution:**

This usually means the API returned an error message instead of JSON.

Check the actual response:

```python
response = requests.post(...)
print(response.status_code)
print(response.text)  # See the actual error
```

Common causes:
- Server not running
- Wrong endpoint URL
- Missing required fields
- Validation error

---

## Quick Diagnostics

Run these commands to check your setup:

```bash
# 1. Check Python version
python --version

# 2. Check if venv is activated
which python  # Linux/Mac
where python  # Windows
# Should show path in venv folder

# 3. Check installed packages
pip list

# 4. Check if server is running
curl http://localhost:8000/health

# 5. Check environment variables
python -c "from app.config import settings; print(settings.GROQ_API_KEY[:10] if settings.GROQ_API_KEY else 'Not set')"

# 6. Test database
python -c "from app.database import init_database; init_database(); print('✅ Database OK')"

# 7. Test AI client
python -c "from app.services.ai import get_groq_client; print('✅ AI configured' if get_groq_client() else '❌ No API key')"
```

---

## Still Having Issues?

1. **Check the logs:** Look at the terminal output for error messages
2. **Verify your setup:** Follow SETUP_GUIDE.md step by step
3. **Run the tests:** `python test_api.py` to see what's failing
4. **Check the docs:** Visit http://localhost:8000/docs to test endpoints
5. **Start fresh:** Delete `venv` folder and recreate it

---

## Getting Help

When reporting issues, include:

1. **Error message:** Full traceback
2. **Python version:** `python --version`
3. **OS:** Windows/Linux/Mac
4. **What you tried:** Commands you ran
5. **Environment:** Contents of `.env` (without API key)

---

## Prevention Tips

✅ **Always activate venv** before working
✅ **Keep dependencies updated:** `pip install --upgrade -r requirements.txt`
✅ **Don't commit `.env`** file (it's in .gitignore)
✅ **Use the startup scripts** for convenience
✅ **Run tests** after making changes
✅ **Check API docs** at /docs for correct request format

---

**Last Updated:** February 14, 2026
