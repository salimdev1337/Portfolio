# n8n Setup Guide for Portfolio Contact Form

Complete guide to setting up n8n workflow automation for your portfolio contact form.

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [n8n Installation](#n8n-installation)
3. [Workflow Import](#workflow-import)
4. [SMTP Configuration](#smtp-configuration)
5. [Webhook URL Configuration](#webhook-url-configuration)
6. [Optional Integrations](#optional-integrations)
7. [Testing](#testing)
8. [Troubleshooting](#troubleshooting)

---

## ✅ Prerequisites

Before starting, ensure you have:

- [ ] n8n instance (cloud or self-hosted)
- [ ] SMTP email account (Gmail, SendGrid, or custom)
- [ ] Access to your backend environment variables
- [ ] (Optional) Discord/Slack webhooks for notifications

---

## 🚀 n8n Installation

### Option 1: n8n Cloud (Easiest)

1. Go to [n8n.cloud](https://n8n.cloud)
2. Sign up for a free account
3. Create a new workspace
4. Skip to [Workflow Import](#workflow-import)

### Option 2: Self-Hosted (Docker)

```bash
# Using Docker
docker run -it --rm \
  --name n8n \
  -p 5678:5678 \
  -v ~/.n8n:/home/node/.n8n \
  n8nio/n8n

# Or using Docker Compose
cat > docker-compose.yml <<EOF
version: '3.8'
services:
  n8n:
    image: n8nio/n8n
    restart: always
    ports:
      - "5678:5678"
    environment:
      - N8N_BASIC_AUTH_ACTIVE=true
      - N8N_BASIC_AUTH_USER=admin
      - N8N_BASIC_AUTH_PASSWORD=change_this_password
    volumes:
      - ~/.n8n:/home/node/.n8n
EOF

docker-compose up -d
```

Access n8n at: http://localhost:5678

### Option 3: Self-Hosted (npm)

```bash
# Install globally
npm install n8n -g

# Run n8n
n8n start

# Or with custom settings
N8N_PORT=5678 n8n start
```

---

## 📥 Workflow Import

1. **Download the workflow template:**
   - File: `backend/n8n/workflows/portfolio-contact-form.json`

2. **Import into n8n:**
   - Open n8n dashboard
   - Click **"+ Add workflow"**
   - Click **"Import from File"**
   - Select `portfolio-contact-form.json`
   - Click **"Import"**

3. **Activate the workflow:**
   - Click **"Active"** toggle in top right
   - Status should show as "Active" (green)

---

## 📧 SMTP Configuration

### Using Gmail (Recommended for Testing)

1. **Enable 2-Factor Authentication:**
   - Go to [myaccount.google.com/security](https://myaccount.google.com/security)
   - Enable 2-Factor Authentication

2. **Generate App Password:**
   - Go to [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
   - Select "Mail" and "Other (Custom name)"
   - Name it "n8n Portfolio"
   - Copy the 16-character password

3. **Configure in n8n:**
   - In workflow, click on "Send Notification Email" node
   - Click "Credentials" → "Create New"
   - Select "SMTP"
   - Enter:
     - **User:** your-gmail@gmail.com
     - **Password:** [16-char app password]
     - **Host:** smtp.gmail.com
     - **Port:** 587
     - **SSL/TLS:** Enable
   - Save credentials
   - Repeat for "Send Auto-Response" node (use same credentials)

### Using SendGrid (Recommended for Production)

1. **Create SendGrid Account:**
   - Go to [sendgrid.com](https://sendgrid.com)
   - Sign up for free (100 emails/day free tier)

2. **Generate API Key:**
   - Go to Settings → API Keys
   - Create API Key with "Mail Send" permissions
   - Copy the API key

3. **Configure in n8n:**
   - In workflow, click on "Send Notification Email" node
   - Click "Credentials" → "Create New"
   - Select "SMTP"
   - Enter:
     - **User:** apikey
     - **Password:** [Your SendGrid API Key]
     - **Host:** smtp.sendgrid.net
     - **Port:** 587
     - **SSL/TLS:** Enable
   - Save credentials

### Using Custom SMTP

```
Host: smtp.yourdomain.com
Port: 587 (or 465 for SSL)
User: noreply@yourdomain.com
Password: [Your password]
SSL/TLS: Enable
```

---

## 🔗 Webhook URL Configuration

### 1. Get Webhook URL from n8n

1. Open your workflow in n8n
2. Click on the **"Webhook"** node (first node)
3. Copy the **Production URL** (should look like):
   ```
   https://your-n8n-instance.com/webhook/portfolio-contact
   ```

### 2. Configure Backend Environment

Update your backend `.env` file:

```bash
# backend/.env
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/portfolio-contact
```

### 3. Test the Connection

```bash
# From backend directory
cd backend
source venv/bin/activate

# Test webhook endpoint
curl -X POST https://your-n8n-instance.com/webhook/portfolio-contact \
  -H "Content-Type: application/json" \
  -d '{
    "request_id": "test-123",
    "timestamp": "2026-02-06T12:00:00Z",
    "form_data": {
      "name": "Test User",
      "email": "test@example.com",
      "subject": "Test Subject",
      "message": "This is a test message",
      "rating": 5
    },
    "metadata": {
      "source": "portfolio_contact_form",
      "version": "1.0.0"
    }
  }'
```

You should receive two emails:
1. Notification email to `salimmtiri17@gmail.com`
2. Auto-response email to `test@example.com`

---

## 🎯 Optional Integrations

### Discord Notifications

1. **Create Discord Webhook:**
   - Open Discord server
   - Edit channel → Integrations → Webhooks
   - Click "New Webhook"
   - Copy webhook URL

2. **Enable in n8n:**
   - Open workflow
   - Find "Discord Notification (Optional)" node
   - Click "Disabled" toggle to enable
   - Add Discord webhook credentials
   - Save workflow

### Slack Notifications

1. **Create Slack App:**
   - Go to [api.slack.com/apps](https://api.slack.com/apps)
   - Create new app
   - Add "chat:write" scope
   - Install to workspace
   - Copy OAuth token

2. **Enable in n8n:**
   - Open workflow
   - Find "Slack Notification (Optional)" node
   - Click "Disabled" toggle to enable
   - Add Slack API credentials
   - Update channel name
   - Save workflow

### Google Sheets Logging

1. **Create Google Sheet:**
   - Create new sheet named "Portfolio Contacts"
   - Add columns: `Timestamp`, `Name`, `Email`, `Subject`, `Message`, `Rating`, `Request ID`

2. **Enable Google Sheets API:**
   - Go to [console.cloud.google.com](https://console.cloud.google.com)
   - Create new project or select existing
   - Enable Google Sheets API
   - Create OAuth 2.0 credentials
   - Download credentials JSON

3. **Enable in n8n:**
   - Open workflow
   - Find "Log to Google Sheets (Optional)" node
   - Click "Disabled" toggle to enable
   - Add Google Sheets credentials
   - Update sheet ID and name
   - Save workflow

---

## 🧪 Testing

### Manual Test via n8n

1. Open your workflow in n8n
2. Click on "Webhook" node
3. Click "Listen for Test Event"
4. Send test request (see curl command above)
5. Check execution log in n8n
6. Verify emails received

### Test via Backend API

```bash
cd backend
source venv/bin/activate
uvicorn app.main:app --reload

# In another terminal
curl -X POST http://localhost:8000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "subject": "Test from Backend",
    "message": "Testing the full integration!",
    "rating": 5
  }'
```

### Test from Frontend

1. Start frontend dev server
2. Fill out contact form
3. Submit form
4. Check:
   - [ ] Backend logs for webhook request
   - [ ] n8n execution log
   - [ ] Notification email received
   - [ ] Auto-response email received

---

## 🐛 Troubleshooting

### Issue: Webhook URL returns 404

**Cause:** Workflow not active or URL incorrect

**Solution:**
1. Ensure workflow is activated (green toggle)
2. Copy webhook URL from "Webhook" node
3. Verify URL in backend `.env` matches exactly
4. Restart backend server

### Issue: Emails not sending

**Cause:** SMTP credentials incorrect or not configured

**Solution:**
1. Test SMTP credentials directly in n8n
2. Check spam folder
3. Verify Gmail app password is correct (16 characters, no spaces)
4. Ensure 2FA is enabled on Gmail account

### Issue: Webhook timeout

**Cause:** Email sending takes too long

**Solution:**
1. Increase backend timeout in `backend/app/services/webhook.py`:
   ```python
   webhook_client = WebhookClient(
       webhook_url=settings.n8n_webhook_url,
       timeout=30  # Increase from 10 to 30 seconds
   )
   ```
2. Consider making email sending async in n8n (split workflow)

### Issue: Rate limiting blocking tests

**Cause:** Too many test requests from same IP

**Solution:**
```bash
# Temporarily increase rate limit in backend/.env
RATE_LIMIT_PER_HOUR=100

# Or clear rate limit cache
# Restart backend server
```

### Issue: Discord/Slack integration not working

**Cause:** Credentials not properly configured or node disabled

**Solution:**
1. Verify credentials are correct
2. Ensure node is enabled (not grayed out)
3. Check webhook URL has correct permissions
4. Test credentials independently in n8n

---

## 📊 Monitoring

### n8n Execution Logs

- Go to **Executions** in n8n sidebar
- View success/failure rate
- Check error messages
- Filter by date range

### Backend Logs

```bash
# View recent logs
cd backend
tail -f logs/app.log

# Or if using systemd
journalctl -u portfolio-backend -f
```

### Email Deliverability

- Check SendGrid dashboard for delivery stats
- Monitor Gmail "Sent" folder
- Set up email alerts for bounces

---

## 🔒 Security Best Practices

1. **Enable Webhook Authentication:**
   - Use webhook signature verification (see Phase 3 implementation)
   - Never expose webhook URL publicly

2. **Protect n8n Instance:**
   - Enable basic auth or OAuth
   - Use HTTPS only
   - Keep n8n updated
   - Use strong credentials

3. **Rate Limiting:**
   - Backend already implements 5 requests/hour per IP
   - Consider adding n8n-level rate limiting for extra protection

4. **Email Security:**
   - Use app passwords, not account passwords
   - Rotate credentials regularly
   - Monitor for suspicious activity

---

## 📚 Additional Resources

- [n8n Documentation](https://docs.n8n.io/)
- [n8n Community](https://community.n8n.io/)
- [Webhook Best Practices](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.webhook/)
- [SMTP Configuration Guide](https://docs.n8n.io/integrations/builtin/credentials/smtp/)

---

## ✅ Setup Checklist

Before deploying to production:

- [ ] n8n workflow imported and activated
- [ ] SMTP credentials configured and tested
- [ ] Webhook URL added to backend `.env`
- [ ] Backend environment variables set on Render
- [ ] Test email sent successfully
- [ ] Auto-response email received
- [ ] Optional integrations configured (Discord/Slack/Sheets)
- [ ] Rate limiting tested
- [ ] Error handling verified
- [ ] Monitoring set up
- [ ] Security best practices implemented

---

**Need help?** Check the [Troubleshooting](#troubleshooting) section or open an issue on GitHub.

**Last Updated:** February 6, 2026
