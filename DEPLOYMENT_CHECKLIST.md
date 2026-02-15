# Deployment Checklist

Complete checklist for deploying NutriSense FastAPI backend to production.

## ✅ Pre-Deployment Checklist

### Code Quality
- [x] All business logic extracted from Streamlit
- [x] No Streamlit dependencies in backend
- [x] All functions have proper error handling
- [x] Input validation with Pydantic models
- [x] Database operations use SQLAlchemy ORM
- [x] No SQL injection vulnerabilities
- [x] No hardcoded secrets or API keys
- [x] All diagnostics pass (no errors)

### Testing
- [x] Test script created (`test_api.py`)
- [x] All endpoints tested
- [x] Validation errors tested
- [x] Database operations tested
- [x] AI integration tested
- [ ] Load testing performed
- [ ] Security testing performed

### Documentation
- [x] README.md created
- [x] API documentation auto-generated
- [x] MIGRATION_GUIDE.md complete
- [x] TESTING_GUIDE.md complete
- [x] EXTRACTION_SUMMARY.md complete
- [x] Environment variables documented
- [x] Deployment guide created

### Configuration
- [x] .env.example created
- [x] .gitignore configured
- [x] CORS origins configured
- [x] Database path configured
- [x] AI model settings configured
- [ ] Production environment variables set

## 🚀 Deployment Steps

### 1. Environment Setup

#### Development
```bash
# Clone repository
git clone <repository-url>
cd nutrisense-react/backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Linux/Mac
# or
venv\Scripts\activate  # Windows

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your settings
```

#### Production
```bash
# Set environment variables
export ENVIRONMENT=production
export GROQ_API_KEY=your_production_key
export DATABASE_URL=sqlite:///./data/soil_history.db

# Or use .env file (recommended)
```

### 2. Database Setup

```bash
# Database is automatically created on first run
# No migration needed if using existing database

# Verify database
python -c "from app.database import init_database; init_database(); print('✅ Database initialized')"
```

### 3. Testing

```bash
# Run test suite
python test_api.py

# Expected output:
# ✅ Health check passed
# ✅ Soil analysis passed
# ✅ Get history passed
# ✅ All tests completed!
```

### 4. Start Server

#### Development
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

#### Production
```bash
# Using Gunicorn with Uvicorn workers
gunicorn app.main:app \
  --workers 4 \
  --worker-class uvicorn.workers.UvicornWorker \
  --bind 0.0.0.0:8000 \
  --timeout 120 \
  --access-logfile - \
  --error-logfile -
```

### 5. Verify Deployment

```bash
# Health check
curl http://localhost:8000/health

# Test analysis endpoint
curl -X POST http://localhost:8000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"soil_data": {...}}'

# Check API docs
# Open: http://localhost:8000/docs
```

## 🐳 Docker Deployment

### Dockerfile

```dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY app/ ./app/

# Create data directory
RUN mkdir -p app/data

# Environment
ENV ENVIRONMENT=production
ENV PYTHONUNBUFFERED=1

# Expose port
EXPOSE 8000

# Run application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Docker Compose

```yaml
version: '3.8'

services:
  api:
    build: .
    ports:
      - "8000:8000"
    environment:
      - GROQ_API_KEY=${GROQ_API_KEY}
      - ENVIRONMENT=production
    volumes:
      - ./data:/app/app/data
    restart: unless-stopped
```

### Build and Run

```bash
# Build image
docker build -t nutrisense-api .

# Run container
docker run -d \
  -p 8000:8000 \
  -e GROQ_API_KEY=your_key \
  -v $(pwd)/data:/app/app/data \
  --name nutrisense \
  nutrisense-api

# Or use docker-compose
docker-compose up -d
```

## ☁️ Cloud Deployment Options

### Option 1: Railway

1. Create account at railway.app
2. Create new project
3. Connect GitHub repository
4. Set environment variables:
   - `GROQ_API_KEY`
   - `ENVIRONMENT=production`
5. Deploy automatically on push

### Option 2: Heroku

```bash
# Install Heroku CLI
heroku login

# Create app
heroku create nutrisense-api

# Set environment variables
heroku config:set GROQ_API_KEY=your_key
heroku config:set ENVIRONMENT=production

# Create Procfile
echo "web: uvicorn app.main:app --host 0.0.0.0 --port \$PORT" > Procfile

# Deploy
git push heroku main
```

### Option 3: AWS EC2

```bash
# SSH into EC2 instance
ssh -i key.pem ubuntu@your-instance

# Install dependencies
sudo apt update
sudo apt install python3-pip python3-venv nginx

# Clone repository
git clone <repository-url>
cd nutrisense-react/backend

# Setup virtual environment
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Configure systemd service
sudo nano /etc/systemd/system/nutrisense.service

# Start service
sudo systemctl start nutrisense
sudo systemctl enable nutrisense

# Configure Nginx reverse proxy
sudo nano /etc/nginx/sites-available/nutrisense
sudo ln -s /etc/nginx/sites-available/nutrisense /etc/nginx/sites-enabled/
sudo systemctl restart nginx
```

### Option 4: DigitalOcean App Platform

1. Create account at digitalocean.com
2. Create new app
3. Connect GitHub repository
4. Configure:
   - Build command: `pip install -r requirements.txt`
   - Run command: `uvicorn app.main:app --host 0.0.0.0 --port 8080`
5. Set environment variables
6. Deploy

## 🔒 Security Checklist

### Before Production
- [ ] Change default secrets
- [ ] Use strong API keys
- [ ] Enable HTTPS only
- [ ] Configure CORS properly
- [ ] Add rate limiting
- [ ] Add authentication (if needed)
- [ ] Enable request logging
- [ ] Set up monitoring
- [ ] Configure firewall rules
- [ ] Regular security updates

### Environment Variables
```bash
# Required
GROQ_API_KEY=<your-production-key>

# Recommended
ENVIRONMENT=production
DATABASE_URL=<production-database-url>
CORS_ORIGINS=https://your-frontend.com

# Optional
API_V1_PREFIX=/api
DEFAULT_AI_MODEL=llama-3.3-70b-versatile
```

## 📊 Monitoring Setup

### Health Checks

```bash
# Add to monitoring service
curl -f http://your-domain.com/health || exit 1
```

### Logging

```python
# Add to app/main.py
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
```

### Metrics

Consider adding:
- Request count
- Response time
- Error rate
- Database query time
- AI API latency

## 🔄 CI/CD Pipeline

### GitHub Actions Example

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Set up Python
        uses: actions/setup-python@v2
        with:
          python-version: 3.11
      - name: Install dependencies
        run: |
          cd backend
          pip install -r requirements.txt
      - name: Run tests
        run: |
          cd backend
          python test_api.py

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to production
        run: |
          # Your deployment commands
```

## 📝 Post-Deployment

### Verify
- [ ] API is accessible
- [ ] Health check returns 200
- [ ] All endpoints working
- [ ] Database is writable
- [ ] AI integration working
- [ ] CORS configured correctly
- [ ] SSL certificate valid

### Monitor
- [ ] Set up uptime monitoring
- [ ] Configure error alerts
- [ ] Monitor API usage
- [ ] Track response times
- [ ] Monitor database size

### Maintain
- [ ] Regular backups
- [ ] Security updates
- [ ] Dependency updates
- [ ] Performance optimization
- [ ] Log rotation

## 🆘 Troubleshooting

### Common Issues

**"Module not found"**
```bash
# Ensure you're in the right directory
cd backend
# Reinstall dependencies
pip install -r requirements.txt
```

**"Database locked"**
```bash
# Check for other connections
lsof | grep soil_history.db
# Restart the server
```

**"CORS error"**
```python
# Update CORS_ORIGINS in config.py
CORS_ORIGINS = ["https://your-frontend.com"]
```

**"AI API timeout"**
```python
# Increase timeout in config.py
AI_TIMEOUT = 60  # seconds
```

## 📞 Support

- Documentation: Check all .md files
- API Docs: http://your-domain.com/docs
- Health Check: http://your-domain.com/health
- Test Suite: `python test_api.py`

## ✅ Final Checklist

Before going live:
- [ ] All tests passing
- [ ] Environment variables set
- [ ] Database backed up
- [ ] HTTPS enabled
- [ ] Monitoring configured
- [ ] Error tracking set up
- [ ] Documentation updated
- [ ] Team trained
- [ ] Rollback plan ready
- [ ] Support contacts documented

---

**Status:** Ready for deployment ✅

**Last Updated:** February 14, 2026

**Version:** 1.0.0
