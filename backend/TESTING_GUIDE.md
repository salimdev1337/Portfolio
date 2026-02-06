# 🧪 Backend API Testing Guide

Complete guide for testing the Portfolio Backend API endpoints.

---

## 📋 Prerequisites

- Python 3.11+ installed
- Virtual environment activated
- Backend server running

---

## 🚀 Quick Start

### 1. Start the Backend Server

```bash
# Make sure you're in the backend directory
cd backend

# Activate virtual environment
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Start the development server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The server should start on `http://localhost:8000`

---

## 🎯 Testing Methods

### Method 1: Interactive API Documentation (Recommended for Beginners)

FastAPI provides **automatic interactive API documentation** at:

**Swagger UI:** http://localhost:8000/docs

**How to use:**
1. Open http://localhost:8000/docs in your browser
2. Click on any endpoint to expand it
3. Click "Try it out" button
4. Fill in the request body
5. Click "Execute"
6. See the response below

**ReDoc (Alternative):** http://localhost:8000/redoc

---

### Method 2: Using the Bash Test Script

We've created a comprehensive test script that tests all endpoints:

```bash
# Make it executable (first time only)
chmod +x test_api.sh

# Run the tests
./test_api.sh

# Test against a different URL
./test_api.sh https://your-backend.onrender.com
```

**What it tests:**
- ✅ Health check endpoint
- ✅ Root endpoint
- ✅ Valid contact form submission
- ✅ Invalid email validation
- ✅ Short name validation
- ✅ XSS prevention

---

### Method 3: Using the Python Test Client

```bash
# Install requests if not already installed
pip install requests

# Run the Python test client
python3 test_client.py
```

---

### Method 4: Using curl Commands

#### Test Health Check
```bash
curl http://localhost:8000/health | python3 -m json.tool
```

Expected response:
```json
{
  "status": "healthy",
  "version": "1.0.0",
  "environment": "development",
  "n8n_configured": true
}
```

#### Test Root Endpoint
```bash
curl http://localhost:8000/ | python3 -m json.tool
```

#### Test Contact Form (Valid)
```bash
curl -X POST http://localhost:8000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john.doe@example.com",
    "subject": "Project Inquiry",
    "message": "I would like to discuss a potential web development project with you.",
    "rating": 5
  }' | python3 -m json.tool
```

Expected response:
```json
{
  "success": true,
  "message": "Thank you for your message! I'll get back to you soon.",
  "request_id": "req_abc123xyz"
}
```

#### Test Validation (Invalid Email)
```bash
curl -X POST http://localhost:8000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "not-an-email",
    "subject": "Test",
    "message": "This should fail",
    "rating": 5
  }' | python3 -m json.tool
```

Expected: HTTP 422 with validation errors

#### Test Rate Limiting
```bash
# Run this 6 times quickly to trigger rate limit
for i in {1..6}; do
  echo "Request $i:"
  curl -X POST http://localhost:8000/api/contact \
    -H "Content-Type: application/json" \
    -d '{
      "name": "Test User",
      "email": "test@example.com",
      "subject": "Test",
      "message": "Testing rate limiting",
      "rating": 5
    }'
  echo ""
done
```

The 6th request should return HTTP 429 (Too Many Requests)

---

### Method 5: Using Postman

1. **Import Collection:**
   - Create a new request
   - Method: POST
   - URL: `http://localhost:8000/api/contact`

2. **Set Headers:**
   ```
   Content-Type: application/json
   ```

3. **Set Body (raw JSON):**
   ```json
   {
     "name": "Jane Smith",
     "email": "jane.smith@example.com",
     "subject": "Testing from Postman",
     "message": "This is a test message from Postman to verify the contact form endpoint works correctly.",
     "rating": 5
   }
   ```

4. **Send Request**

---

### Method 6: Using VS Code Thunder Client Extension

1. Install Thunder Client extension
2. Create new request
3. Set method to POST
4. URL: `http://localhost:8000/api/contact`
5. Headers: `Content-Type: application/json`
6. Body: (same as Postman example above)
7. Send

---

### Method 7: Using HTTPie (if installed)

```bash
# Install httpie
pip install httpie

# Test health check
http GET http://localhost:8000/health

# Test contact form
http POST http://localhost:8000/api/contact \
  name="John Doe" \
  email="john@example.com" \
  subject="Test" \
  message="This is a test message from HTTPie" \
  rating:=5
```

---

### Method 8: Run the Test Suite (Pytest)

```bash
# Install dev dependencies if not already installed
pip install -r requirements-dev.txt

# Run all tests
pytest tests/ -v

# Run with coverage
pytest tests/ -v --cov=app --cov-report=term-missing

# Run specific test file
pytest tests/test_contact.py -v

# Run specific test
pytest tests/test_contact.py::test_contact_form_success -v
```

---

## 📊 Test Scenarios

### ✅ Valid Contact Form
- **Name:** 2-50 characters, letters/spaces/hyphens only
- **Email:** Valid email format (user@domain.com)
- **Subject:** 3-100 characters
- **Message:** 10-1000 characters
- **Rating:** 0-5 (integer)

### ❌ Invalid Scenarios to Test

1. **Short name** (1 character) → HTTP 422
2. **Invalid email** (not-an-email) → HTTP 422
3. **Short subject** (< 3 chars) → HTTP 422
4. **Short message** (< 10 chars) → HTTP 422
5. **Rating out of range** (6 or -1) → HTTP 422
6. **XSS attempt** (`<script>alert('xss')</script>`) → HTTP 400 or sanitized
7. **SQL injection** (`'; DROP TABLE users; --`) → HTTP 400
8. **Disposable email** (test@tempmail.com) → HTTP 400
9. **Rate limit exceeded** (6th request in an hour) → HTTP 429

---

## 🔍 Debugging Tips

### Check Server Logs
The server logs will show:
- Request IDs for tracking
- Validation errors
- Security warnings (XSS attempts, SQL injection)
- Rate limit violations
- Webhook errors

### Common Issues

**Issue:** Connection refused
**Solution:** Make sure the server is running (`uvicorn app.main:app --reload`)

**Issue:** 422 Validation Error
**Solution:** Check the error details in the response to see which field failed validation

**Issue:** 503 Webhook Error
**Solution:** Check that N8N_WEBHOOK_URL in .env is correct and the webhook is active

**Issue:** 429 Too Many Requests
**Solution:** Wait an hour or increase RATE_LIMIT_PER_HOUR in .env for testing

---

## 🎯 Expected HTTP Status Codes

| Code | Meaning | When |
|------|---------|------|
| 200 | Success | Valid contact form submitted |
| 400 | Bad Request | Dangerous content detected |
| 422 | Validation Error | Invalid input (email, length, etc.) |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Error | Unexpected server error |
| 503 | Service Unavailable | n8n webhook error |

---

## 📈 Performance Testing

### Test Response Time
```bash
time curl -X POST http://localhost:8000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Speed Test",
    "email": "speed@example.com",
    "subject": "Performance Test",
    "message": "Testing response time",
    "rating": 5
  }'
```

Target: < 200ms for 95th percentile

### Load Testing (with Apache Bench)
```bash
# Install Apache Bench
sudo apt-get install apache2-utils  # Linux
brew install apache2              # Mac

# Run load test (100 requests, 10 concurrent)
ab -n 100 -c 10 -T application/json -p contact.json http://localhost:8000/api/contact
```

Create `contact.json`:
```json
{
  "name": "Load Test",
  "email": "load@example.com",
  "subject": "Load Testing",
  "message": "This is a load test message",
  "rating": 5
}
```

---

## 🚀 Next Steps

1. ✅ Test all endpoints locally
2. ✅ Run the test suite (`pytest`)
3. ✅ Set up n8n webhook (see n8n setup guide)
4. ✅ Deploy to Render
5. ✅ Test production endpoints
6. ✅ Integrate with frontend

---

## 📞 Troubleshooting

If you encounter issues:

1. Check server is running: `ps aux | grep uvicorn`
2. Check logs for errors
3. Verify .env file has all required variables
4. Test with curl first before using other tools
5. Run pytest to ensure code is working

---

## 🎉 Success Criteria

Your backend is working correctly if:

- ✅ Health check returns HTTP 200
- ✅ Valid contact form returns HTTP 200 with success message
- ✅ Invalid emails return HTTP 422
- ✅ XSS attempts are blocked/sanitized
- ✅ Rate limiting works (6th request fails)
- ✅ All pytest tests pass
- ✅ API docs are accessible at /docs

Happy testing! 🚀
