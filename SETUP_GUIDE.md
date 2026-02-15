# Setup Guide - Virtual Environment

## Why Use a Virtual Environment?

✅ **Isolates dependencies** - Won't conflict with other Python projects
✅ **Clean installation** - Only installs what you need
✅ **Reproducible** - Same environment on any machine
✅ **Safe** - Won't mess with system Python packages

## Quick Setup (Recommended)

### Windows

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate it
venv\Scripts\activate

# You should see (venv) in your prompt
# Install dependencies
pip install -r requirements.txt

# Configure environment
copy .env.example .env
# Edit .env and add your GROQ_API_KEY

# Run the server
uvicorn app.main:app --reload
```

### Linux/Mac

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python3 -m venv venv

# Activate it
source venv/bin/activate

# You should see (venv) in your prompt
# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env and add your GROQ_API_KEY

# Run the server
uvicorn app.main:app --reload
```

## Using the Startup Scripts

I've already created startup scripts that handle the virtual environment for you!

### Windows
```bash
cd backend
start.bat
```

### Linux/Mac
```bash
cd backend
chmod +x start.sh
./start.sh
```

These scripts will:
1. Create venv if it doesn't exist
2. Activate the virtual environment
3. Install all dependencies
4. Start the server

## Manual Step-by-Step

### 1. Create Virtual Environment

```bash
cd backend
python -m venv venv
```

This creates a `venv` folder with an isolated Python environment.

### 2. Activate Virtual Environment

**Windows (Command Prompt):**
```bash
venv\Scripts\activate.bat
```

**Windows (PowerShell):**
```bash
venv\Scripts\Activate.ps1
```

**Linux/Mac:**
```bash
source venv/bin/activate
```

**You'll know it's activated when you see `(venv)` in your prompt:**
```
(venv) C:\Users\YourName\nutrisense-react\backend>
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

This installs:
- FastAPI
- Uvicorn
- SQLAlchemy
- Pydantic
- Groq
- And all other dependencies

### 4. Configure Environment

```bash
# Windows
copy .env.example .env

# Linux/Mac
cp .env.example .env
```

Edit `.env` file and add your GROQ_API_KEY:
```env
GROQ_API_KEY=your_actual_key_here
```

Get a free key from: https://console.groq.com/

### 5. Run the Server

```bash
uvicorn app.main:app --reload
```

### 6. Test It

Open another terminal (keep the server running):

```bash
# Activate venv in the new terminal too
cd backend
source venv/bin/activate  # or venv\Scripts\activate on Windows

# Run tests
python test_api.py
```

## Deactivating Virtual Environment

When you're done working:

```bash
deactivate
```

The `(venv)` prefix will disappear from your prompt.

## Troubleshooting

### "python: command not found"

**Windows:** Use `python` instead of `python3`
**Linux/Mac:** Use `python3` instead of `python`

### "Permission denied" on Linux/Mac

```bash
chmod +x start.sh
```

### PowerShell Execution Policy Error

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### "pip: command not found"

```bash
python -m pip install -r requirements.txt
```

### Virtual Environment Not Activating

**Make sure you're in the backend directory:**
```bash
cd backend
ls venv  # Should show the venv folder
```

**Try absolute path:**
```bash
# Windows
C:\path\to\backend\venv\Scripts\activate.bat

# Linux/Mac
source /path/to/backend/venv/bin/activate
```

## Verifying Your Setup

After activation, check:

```bash
# Should show path inside venv folder
which python  # Linux/Mac
where python  # Windows

# Should show installed packages
pip list

# Should include: fastapi, uvicorn, sqlalchemy, groq, pydantic
```

## IDE Integration

### VS Code

1. Open Command Palette (Ctrl+Shift+P / Cmd+Shift+P)
2. Type "Python: Select Interpreter"
3. Choose the one in `backend/venv/`

VS Code will automatically activate the venv in its terminal.

### PyCharm

1. File → Settings → Project → Python Interpreter
2. Click gear icon → Add
3. Select "Existing environment"
4. Browse to `backend/venv/Scripts/python.exe` (Windows) or `backend/venv/bin/python` (Linux/Mac)

## Best Practices

### Always Activate Before Working

```bash
cd backend
source venv/bin/activate  # or venv\Scripts\activate
```

### Update Dependencies

```bash
pip install --upgrade -r requirements.txt
```

### Freeze Dependencies (if you add new packages)

```bash
pip freeze > requirements.txt
```

### Clean Install

If something goes wrong:

```bash
# Deactivate first
deactivate

# Remove old venv
rm -rf venv  # Linux/Mac
rmdir /s venv  # Windows

# Create fresh venv
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

## Quick Reference

| Task | Windows | Linux/Mac |
|------|---------|-----------|
| Create venv | `python -m venv venv` | `python3 -m venv venv` |
| Activate | `venv\Scripts\activate` | `source venv/bin/activate` |
| Deactivate | `deactivate` | `deactivate` |
| Install deps | `pip install -r requirements.txt` | `pip install -r requirements.txt` |
| Run server | `uvicorn app.main:app --reload` | `uvicorn app.main:app --reload` |

## What Gets Installed?

From `requirements.txt`:

```
fastapi==0.109.0          # Web framework
uvicorn[standard]==0.27.0 # ASGI server
pydantic>=2.0             # Data validation
pydantic-settings==2.1.0  # Settings management
sqlalchemy==2.0.25        # Database ORM
groq==0.4.2               # AI API client
python-dotenv==1.0.0      # Environment variables
python-multipart==0.0.6   # File uploads
requests==2.31.0          # HTTP client (testing)
pytest==7.4.4             # Testing framework
httpx==0.26.0             # Async HTTP client
```

## Summary

**Recommended workflow:**

```bash
# First time setup
cd backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your GROQ_API_KEY

# Every time you work
cd backend
source venv/bin/activate  # or venv\Scripts\activate
uvicorn app.main:app --reload

# When done
deactivate
```

**Or just use the startup script:**

```bash
cd backend
./start.sh  # Linux/Mac
start.bat   # Windows
```

That's it! Your environment is isolated and ready to go. 🚀
