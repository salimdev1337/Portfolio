# Portfolio Backend API

FastAPI backend for the portfolio contact form with comprehensive security features.

## Features

- ✅ **FastAPI** - Modern async web framework
- ✅ **Rate Limiting** - Prevent spam (5 requests/hour per IP)
- ✅ **Input Validation** - Pydantic models with XSS/SQL injection protection
- ✅ **n8n Integration** - Webhook forwarding for notifications
- ✅ **CORS Protection** - Strict origin allowlist
- ✅ **Structured Logging** - JSON logs for production
- ✅ **Comprehensive Tests** - Unit and integration tests
- ✅ **Auto Documentation** - Interactive API docs at `/docs`

## Local Development

### Prerequisites

- Python 3.11+
- pip and virtualenv

### Setup

1. **Create virtual environment:**
   ```bash
   python3.11 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   pip install -r requirements-dev.txt
   ```

3. **Configure environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your values
   ```

4. **Generate secret key:**
   ```bash
   python -c "import secrets; print(secrets.token_hex(32))"
   ```

5. **Run development server:**
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

6. **Access API docs:**
   - Swagger UI: http://localhost:8000/docs
   - ReDoc: http://localhost:8000/redoc

## Testing

### Run all tests:
```bash
pytest tests/ -v
```

### Run with coverage:
```bash
pytest tests/ -v --cov=app --cov-report=term-missing
```

### Run specific test file:
```bash
pytest tests/test_contact.py -v
```

## Code Quality

### Linting:
```bash
flake8 app/ tests/ --max-line-length=100
```

### Type checking:
```bash
mypy app/ --ignore-missing-imports
```

### Code formatting:
```bash
black app/ tests/
isort app/ tests/
```

### Security scanning:
```bash
bandit -r app/
safety check
```

## Deployment

### Render (Recommended)

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set environment variables from `.env.example`
4. Deploy!

### Environment Variables

Required:
- `SECRET_KEY` - Generate with: `python -c "import secrets; print(secrets.token_hex(32))"`
- `N8N_WEBHOOK_URL` - Your n8n webhook URL
- `ALLOWED_ORIGINS` - Comma-separated list of allowed origins

Optional:
- `DEBUG` - Set to `True` for development (default: `False`)
- `ENVIRONMENT` - `development` or `production` (default: `production`)
- `RATE_LIMIT_PER_HOUR` - Requests per hour per IP (default: `5`)
- `LOG_LEVEL` - `DEBUG`, `INFO`, `WARNING`, `ERROR` (default: `INFO`)

## API Endpoints

### Health Check
```http
GET /health
```
Returns service health status, version, and configuration.

### Contact Form
```http
POST /api/contact
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Project Inquiry",
  "message": "I would like to discuss a project...",
  "rating": 5
}
```

## Security

- **Rate Limiting**: 5 requests/hour per IP address
- **Input Validation**: Pydantic models with strict validation
- **XSS Prevention**: HTML sanitization with bleach
- **SQL Injection**: Pattern matching (defense in depth)
- **CORS**: Strict origin allowlist
- **Disposable Emails**: Blocked common disposable email domains

## Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI app entry point
│   ├── config.py            # Configuration management
│   ├── models.py            # Pydantic models
│   ├── routes/              # API endpoints
│   ├── services/            # Business logic
│   ├── middleware/          # Rate limiting, etc.
│   └── utils/               # Logger, exceptions
├── tests/                   # Test suite
├── requirements.txt         # Production dependencies
├── requirements-dev.txt     # Development dependencies
├── .env.example            # Environment template
└── README.md               # This file
```

## Troubleshooting

### Issue: "ModuleNotFoundError"
**Solution**: Make sure you're in the virtual environment and dependencies are installed:
```bash
source venv/bin/activate
pip install -r requirements.txt
```

### Issue: "SECRET_KEY validation error"
**Solution**: Make sure your `SECRET_KEY` in `.env` is at least 32 characters long.

### Issue: "n8n webhook timeout"
**Solution**: Check that your n8n webhook URL is correct and the workflow is active.

### Issue: "CORS error in frontend"
**Solution**: Make sure your frontend URL is in the `ALLOWED_ORIGINS` environment variable.

## License

MIT
