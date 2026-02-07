# n8n Integration for Portfolio Contact Form

Complete n8n automation workflow for handling portfolio contact form submissions with email notifications, security, and monitoring.

---

## 📁 Directory Structure

```
n8n/
├── workflows/
│   └── portfolio-contact-form.json    # Importable n8n workflow
├── templates/
│   ├── notification-email.html        # Email to portfolio owner
│   ├── auto-response-email.html       # Auto-reply to sender
│   └── README.md                      # Template documentation
├── docs/
│   ├── N8N_SETUP_GUIDE.md            # Complete setup instructions
│   └── WEBHOOK_SECURITY.md           # Security implementation guide
└── README.md                          # This file
```

---

## 🚀 Quick Start

### 1. Import Workflow

```bash
# Download workflow template
File: workflows/portfolio-contact-form.json

# Import into n8n
1. Open n8n dashboard
2. Click "+ Add workflow"
3. Click "Import from File"
4. Select portfolio-contact-form.json
5. Activate workflow
```

### 2. Configure SMTP

```bash
# In n8n workflow, configure email nodes with:
- Gmail (recommended for testing)
- SendGrid (recommended for production)
- Or custom SMTP

See: docs/N8N_SETUP_GUIDE.md for detailed instructions
```

### 3. Set Webhook URL

```bash
# Get webhook URL from n8n
1. Open workflow
2. Click "Webhook" node
3. Copy Production URL

# Add to backend/.env
echo "N8N_WEBHOOK_URL=<your-webhook-url>" >> backend/.env

# Restart backend
uvicorn app.main:app --reload
```

### 4. Test Integration

```bash
# Test contact form
curl -X POST http://localhost:8000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "subject": "Test",
    "message": "Testing n8n integration",
    "rating": 5
  }'

# Check webhook health
curl http://localhost:8000/api/webhook/health
```

---

## ✨ Features

### 📧 Email Notifications

**Notification Email** (Dark Theme)
- Sent to portfolio owner (salimmtiri17@gmail.com)
- Retro pixel art design matching portfolio
- All contact details and message
- Direct reply button
- Request tracking metadata

**Auto-Response Email** (Light Theme)
- Sent to form submitter
- Professional, friendly tone
- Submission confirmation
- Response time expectations
- Social links and contact info

### 🔐 Security Features

**Webhook Signature Verification**
- HMAC-SHA256 signatures
- Prevents unauthorized requests
- Tamper detection
- Optional but strongly recommended

**Rate Limiting**
- Backend: 5 requests/hour per IP
- Prevents spam and abuse
- Configurable limits

**Input Validation**
- XSS protection
- SQL injection prevention
- Email format validation
- Disposable email blocking

### 📊 Monitoring

**Webhook Health Check**
- `/api/webhook/health` - Test connectivity
- `/api/webhook/config` - View configuration
- Response time tracking
- Failure detection

**Logging**
- Structured JSON logs
- Request ID tracking
- Error monitoring
- Execution history in n8n

### 🎯 Optional Integrations

**Discord Notifications** (Optional)
- Real-time contact alerts in Discord
- Customizable message format
- Enable in workflow

**Slack Notifications** (Optional)
- Post to Slack channel
- Team collaboration
- Enable in workflow

**Google Sheets Logging** (Optional)
- Automatic submission logging
- Data backup and analysis
- Enable in workflow

---

## 📖 Documentation

### 📘 Setup Guides

1. **[N8N Setup Guide](docs/N8N_SETUP_GUIDE.md)**
   - Complete installation instructions
   - SMTP configuration (Gmail, SendGrid)
   - Webhook URL configuration
   - Optional integrations
   - Testing procedures
   - Troubleshooting

2. **[Webhook Security Guide](docs/WEBHOOK_SECURITY.md)**
   - Signature verification implementation
   - Security best practices
   - n8n Function node code
   - Testing security features
   - Monitoring and alerts

3. **[Email Templates Guide](templates/README.md)**
   - Template customization
   - Variable usage
   - Testing in email clients
   - Design best practices

---

## 🔧 Configuration

### Backend Environment Variables

```bash
# Required
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/portfolio-contact

# Optional but Recommended
N8N_WEBHOOK_SECRET=64-character-hex-secret

# Optional
N8N_TIMEOUT=10  # Webhook timeout in seconds (default: 10)
```

### n8n Workflow Configuration

**Email Nodes:**
- Update `fromEmail` and `toEmail` addresses
- Configure SMTP credentials
- Customize email content

**Optional Nodes:**
- Enable/disable Discord notifications
- Enable/disable Slack notifications
- Enable/disable Google Sheets logging

---

## 🧪 Testing

### Test Webhook Health

```bash
# Check if n8n is reachable
curl http://localhost:8000/api/webhook/health

# Response:
{
  "healthy": true,
  "webhook_url": "https://n8n.example.com/webhook/***",
  "response_time_ms": 234,
  "status_code": 200,
  "timestamp": "2026-02-06T12:00:00Z",
  "details": {
    "signature_enabled": true,
    "timeout_seconds": 10,
    "environment": "development"
  }
}
```

### Test Contact Form

```bash
# Submit test contact form
curl -X POST http://localhost:8000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "subject": "Project Inquiry",
    "message": "Hello! I would like to discuss a project.",
    "rating": 5
  }'

# Expected: 200 response + 2 emails received
```

### Test Signature Verification

```bash
# Generate webhook secret
python -c "import secrets; print(secrets.token_hex(32))"

# Add to backend/.env
N8N_WEBHOOK_SECRET=<generated-secret>

# Add verification node to n8n workflow
# See: docs/WEBHOOK_SECURITY.md

# Test valid signature (via backend)
curl -X POST http://localhost:8000/api/contact -d '...'
# Should succeed

# Test invalid signature (direct to n8n)
curl -X POST https://your-n8n.com/webhook/contact \
  -H "X-Webhook-Signature: invalid" \
  -d '...'
# Should be rejected
```

### Run Integration Tests

```bash
cd backend

# Run all n8n integration tests
pytest tests/test_n8n_integration.py -v

# Run specific test
pytest tests/test_n8n_integration.py::TestN8NIntegration::test_complete_contact_form_flow -v

# Run with coverage
pytest tests/test_n8n_integration.py -v --cov=app.services.webhook --cov=app.utils.security
```

---

## 📊 Workflow Flow

```
User submits form
      ↓
Frontend (React)
      ↓
Backend API (FastAPI)
      ├── Validation
      ├── Rate limiting
      └── Generate signature
      ↓
n8n Webhook
      ├── Verify signature (optional)
      ├── Extract data
      ├── Send notification email → Portfolio owner
      ├── Send auto-response email → User
      ├── Post to Discord (optional)
      ├── Post to Slack (optional)
      ├── Log to Google Sheets (optional)
      └── Respond to backend
      ↓
Backend returns success
      ↓
Frontend shows confirmation
```

---

## 🐛 Troubleshooting

### Webhook Not Receiving Requests

**Check:**
1. n8n workflow is activated (green toggle)
2. Webhook URL in backend `.env` is correct
3. Backend can reach n8n (firewall/network)
4. Check backend logs for webhook errors

**Fix:**
```bash
# Test webhook health
curl http://localhost:8000/api/webhook/health

# Check backend logs
tail -f backend/logs/app.log

# Verify n8n is running
curl https://your-n8n-instance.com/healthz
```

### Emails Not Sending

**Check:**
1. SMTP credentials are correct
2. Gmail 2FA is enabled (if using Gmail)
3. App password is correct (not account password)
4. Email nodes are not disabled in workflow

**Fix:**
```bash
# Test SMTP in n8n directly
# 1. Click email node
# 2. Click "Test step"
# 3. Check execution log

# Check spam folder
# Gmail may mark auto-sent emails as spam initially
```

### Signature Verification Failing

**Check:**
1. Secret in backend `.env` matches n8n Function node
2. No whitespace in secret
3. Function node is placed after Webhook node
4. Payload structure matches expected format

**Fix:**
```bash
# Debug in n8n Function node
console.log('Received signature:', receivedSignature);
console.log('Expected signature:', expectedSignature);

# Verify secret is loaded in backend
cd backend
python -c "from app.config import settings; print(settings.n8n_webhook_secret[:8])"
```

### Rate Limiting Blocking Tests

**Fix:**
```bash
# Temporarily increase limit
echo "RATE_LIMIT_PER_HOUR=100" >> backend/.env

# Restart backend
uvicorn app.main:app --reload
```

---

## 🚀 Deployment

### Production Checklist

- [ ] n8n workflow imported and tested
- [ ] SMTP credentials configured (SendGrid recommended)
- [ ] Webhook URL set in production backend
- [ ] Webhook signature verification enabled
- [ ] Email addresses updated (from/to)
- [ ] Optional integrations configured
- [ ] Health check endpoint accessible
- [ ] Monitoring/alerting set up
- [ ] Test emails sent successfully
- [ ] Rate limiting configured appropriately
- [ ] Logs being collected

### Render Deployment

```bash
# Backend environment variables on Render
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/portfolio-contact
N8N_WEBHOOK_SECRET=<64-char-secret>
SECRET_KEY=<32-char-secret>
ALLOWED_ORIGINS=https://yourusername.github.io
RATE_LIMIT_PER_HOUR=5
```

### n8n Cloud vs Self-Hosted

**n8n Cloud (Recommended for beginners):**
- ✅ Easy setup, no infrastructure management
- ✅ Automatic updates and backups
- ✅ Free tier available (200 executions/month)
- ❌ Limited to cloud pricing after free tier

**Self-Hosted (Recommended for advanced):**
- ✅ Unlimited executions
- ✅ Full control and customization
- ✅ One-time setup cost
- ❌ Requires server management

---

## 📚 Additional Resources

- [n8n Documentation](https://docs.n8n.io/)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [SendGrid Documentation](https://docs.sendgrid.com/)
- [Gmail App Passwords](https://support.google.com/accounts/answer/185833)
- [HMAC Security](https://en.wikipedia.org/wiki/HMAC)

---

## 🤝 Support

**Issues?**
- Check [Troubleshooting](#troubleshooting) section
- Review [N8N Setup Guide](docs/N8N_SETUP_GUIDE.md)
- Check n8n execution logs
- Review backend logs

**Questions?**
- Open an issue on GitHub
- Check n8n Community forum
- Email: salimmtiri17@gmail.com

---

## 📄 License

MIT License - See LICENSE file for details

---

**Version:** 1.0.0
**Last Updated:** February 6, 2026
**Status:** ✅ Production Ready
