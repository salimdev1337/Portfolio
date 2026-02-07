# Render Setup Guide - Portfolio Backend

This guide will walk you through setting up your FastAPI backend on Render's free tier.

---

## 📋 Prerequisites

Before starting, ensure you have:
- [ ] GitHub account with your portfolio repository
- [ ] Backend code committed and pushed to GitHub
- [ ] n8n webhook URL ready (or set up n8n first)

---

## 🚀 Step-by-Step Setup

### Step 1: Create Render Account

1. Go to [render.com](https://render.com)
2. Click **Get Started for Free**
3. Sign up with GitHub (recommended for easier deployment)
4. Authorize Render to access your GitHub account

---

### Step 2: Create New Web Service

1. **Dashboard**: After logging in, click **New +** (top right)
2. **Select**: Choose **Web Service**
3. **Connect Repository**:
   - If first time: Click **Configure Account** to give Render access
   - Select your portfolio repository
   - Click **Connect**

---

### Step 3: Configure Service Settings

Fill in the following configuration:

#### Basic Settings

| Field | Value | Notes |
|-------|-------|-------|
| **Name** | `portfolio-backend` | This will be part of your URL |
| **Region** | `Oregon (US West)` | Choose closest to your users |
| **Branch** | `main` | Auto-deploy from this branch |
| **Root Directory** | `backend` | Path to backend folder |
| **Runtime** | `Python 3` | Auto-detected |

#### Build & Deploy Settings

| Field | Value |
|-------|-------|
| **Build Command** | `pip install -r requirements.txt` |
| **Start Command** | `gunicorn app.main:app --workers 2 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:$PORT --log-level info` |

#### Instance Type

- **Plan**: `Free` (0 USD/month)
  - 512 MB RAM
  - Auto-sleep after 15 minutes of inactivity
  - First request after sleep takes ~30 seconds

> **Note**: Free tier is perfect for portfolio projects. Upgrade to Starter ($7/mo) for:
> - No sleep
> - 512 MB → 2 GB RAM
> - Better performance

---

### Step 4: Configure Environment Variables

Click **Advanced** → **Add Environment Variable**

Add the following variables:

#### Required Variables

```bash
# 1. Python Version
PYTHON_VERSION = 3.11.0

# 2. Secret Key (GENERATE THIS - DO NOT COPY)
# Click "Generate" button or use: python -c "import secrets; print(secrets.token_hex(32))"
SECRET_KEY = <click Generate button>

# 3. n8n Webhook URL
# Get this from your n8n workflow (webhook node URL)
N8N_WEBHOOK_URL = https://your-n8n-instance.app.n8n.cloud/webhook/portfolio-contact

# 4. Allowed CORS Origins
# Add your GitHub Pages URL (you'll get this after frontend deploys)
# For now, use a placeholder - update later
ALLOWED_ORIGINS = https://yourusername.github.io,http://localhost:5173

# 5. Environment
ENVIRONMENT = production

# 6. Log Level
LOG_LEVEL = INFO

# 7. Rate Limit (optional)
RATE_LIMIT_PER_HOUR = 5
```

#### How to Get Values:

**SECRET_KEY**:
```bash
# Run locally:
python -c "import secrets; print(secrets.token_hex(32))"
# Copy the output
```

**N8N_WEBHOOK_URL**:
- See n8n setup section below
- Or use temporary: `https://webhook.site/your-unique-url` (for testing)

**ALLOWED_ORIGINS**:
- Will be: `https://<your-github-username>.github.io`
- Example: `https://johndoe.github.io`
- Keep `http://localhost:5173` for local testing

---

### Step 5: Configure Auto-Deploy

**IMPORTANT**: Disable auto-deploy since we're using GitHub Actions

1. Scroll to **Auto-Deploy**
2. Set to: **No** (we control deploys via GitHub Actions)

---

### Step 6: Configure Health Checks

1. Scroll to **Health Check Path**
2. Enter: `/health`
3. This ensures Render knows when your service is ready

---

### Step 7: Create Service

1. Review all settings
2. Click **Create Web Service**
3. Wait for initial deployment (3-5 minutes)
4. Monitor logs in real-time

---

### Step 8: Verify Deployment

Once deployed, you'll get a URL like:
```
https://portfolio-backend-abc123.onrender.com
```

**Test the endpoints**:

```bash
# 1. Health check
curl https://your-backend-url.onrender.com/health

# Expected response:
{
  "status": "healthy",
  "version": "1.0.0",
  "environment": "production",
  "n8n_configured": true
}

# 2. API docs (if in development)
# Visit: https://your-backend-url.onrender.com/docs

# 3. Test contact endpoint
curl -X POST https://your-backend-url.onrender.com/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "subject": "Test Subject",
    "message": "This is a test message to verify the API works",
    "rating": 5
  }'
```

---

### Step 9: Get Deploy Hook URL

For GitHub Actions to trigger deployments:

1. Go to your service dashboard
2. Click **Settings** (left sidebar)
3. Scroll to **Deploy Hook**
4. Click **Copy**
5. Save this URL - you'll add it to GitHub Secrets

The URL looks like:
```
https://api.render.com/deploy/srv-xxxxxxxxxxxxx?key=xxxxxxxxxxxxxxxx
```

**IMPORTANT**: Keep this URL secret! Anyone with it can trigger deployments.

---

### Step 10: Add Deploy Hook to GitHub

1. Go to your GitHub repository
2. **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Name: `RENDER_DEPLOY_HOOK_URL`
5. Value: Paste the deploy hook URL
6. Click **Add secret**

---

### Step 11: Add Backend URL to GitHub

1. Still in GitHub Secrets
2. Click **New repository secret**
3. Name: `BACKEND_API_URL`
4. Value: Your Render service URL (e.g., `https://portfolio-backend-abc123.onrender.com`)
5. Click **Add secret**

---

### Step 12: Update Frontend Environment Variable

1. In GitHub Secrets, verify `BACKEND_API_URL` matches your Render URL
2. Update `ALLOWED_ORIGINS` in Render:
   - Go back to Render dashboard
   - Settings → Environment
   - Edit `ALLOWED_ORIGINS`
   - Add your GitHub Pages URL: `https://yourusername.github.io`
   - Click **Save Changes**

---

## 🔗 Setting Up n8n (If Not Done)

### Option 1: n8n Cloud (Easiest)

1. Go to [n8n.io](https://n8n.io)
2. Sign up for free account
3. Create new workflow
4. Add **Webhook** node
5. Set HTTP Method: POST
6. Set Path: `portfolio-contact`
7. Copy webhook URL
8. Add **Email** node (or other notification)
9. Connect nodes
10. **Activate** workflow
11. Copy webhook URL and add to Render environment variables

### Option 2: Self-Hosted n8n

```bash
# Using Docker
docker run -it --rm \
  --name n8n \
  -p 5678:5678 \
  -v ~/.n8n:/home/node/.n8n \
  n8nio/n8n

# Access at: http://localhost:5678
# Set up workflow
# Use ngrok or similar for public URL
```

### Simple n8n Workflow

```json
{
  "nodes": [
    {
      "name": "Webhook",
      "type": "n8n-nodes-base.webhook",
      "position": [250, 300],
      "parameters": {
        "httpMethod": "POST",
        "path": "portfolio-contact"
      }
    },
    {
      "name": "Email",
      "type": "n8n-nodes-base.emailSend",
      "position": [450, 300],
      "parameters": {
        "toEmail": "your-email@gmail.com",
        "subject": "=📬 Portfolio Contact: {{$json.form_data.subject}}",
        "text": "=Name: {{$json.form_data.name}}\nEmail: {{$json.form_data.email}}\n\nMessage:\n{{$json.form_data.message}}"
      }
    }
  ]
}
```

---

## 🧪 Testing the Complete Flow

### 1. Test Backend Health

```bash
curl https://your-backend.onrender.com/health
```

### 2. Test Contact Form Endpoint

```bash
curl -X POST https://your-backend.onrender.com/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "subject": "Testing Contact Form",
    "message": "This is a test message to verify everything works correctly.",
    "rating": 5
  }'
```

Expected response:
```json
{
  "success": true,
  "message": "Thank you for your message! I'll get back to you soon.",
  "request_id": "req_abc123xyz"
}
```

### 3. Verify n8n Received Data

- Check your email for notification
- Or check n8n workflow executions

### 4. Test Rate Limiting

```bash
# Make 6 requests quickly
for i in {1..6}; do
  echo "Request $i:"
  curl -X POST https://your-backend.onrender.com/api/contact \
    -H "Content-Type: application/json" \
    -d '{"name":"Test","email":"test@test.com","subject":"Test","message":"Test message here","rating":5}'
  echo -e "\n"
done
```

The 6th request should return HTTP 429 (Too Many Requests).

---

## 🐛 Troubleshooting

### Issue: Build Fails

**Error**: `Could not find a version that satisfies the requirement`

**Solution**:
- Check `requirements.txt` has correct package names
- Verify Python version is 3.11
- Check Render logs for specific missing package

### Issue: Service Won't Start

**Error**: `Error: bind: address already in use`

**Solution**:
- Ensure start command uses `$PORT` variable
- Correct: `--bind 0.0.0.0:$PORT`
- Wrong: `--bind 0.0.0.0:8000`

### Issue: Environment Variable Not Found

**Error**: `ValidationError: N8N_WEBHOOK_URL field required`

**Solution**:
- Go to Render Settings → Environment
- Verify variable name is EXACTLY `N8N_WEBHOOK_URL`
- No extra spaces or quotes
- Click **Save Changes**
- **Manual Deploy** to apply changes

### Issue: CORS Error from Frontend

**Error**: `Access to fetch has been blocked by CORS policy`

**Solution**:
1. Check `ALLOWED_ORIGINS` includes your GitHub Pages URL
2. Format: `https://username.github.io` (no trailing slash)
3. Multiple origins: `https://username.github.io,http://localhost:5173`
4. Restart service after updating

### Issue: Health Check Fails

**Error**: Service keeps restarting

**Solution**:
- Verify `/health` endpoint returns 200 OK
- Test locally: `uvicorn app.main:app --reload`
- Check logs for Python errors
- Verify all dependencies installed

### Issue: Deploy Hook Not Working

**Error**: GitHub Actions can't trigger deploy

**Solution**:
- Verify deploy hook URL is complete (includes `?key=...`)
- Check URL is saved in GitHub Secrets (not in code)
- Try triggering manually: `curl -X POST "$DEPLOY_HOOK_URL"`

---

## 📊 Monitoring & Logs

### Viewing Logs

1. Render Dashboard → Your Service
2. **Logs** tab (left sidebar)
3. Filter by:
   - Deploy logs
   - Runtime logs
   - Error logs

### Setting Up Alerts

1. Render Dashboard → Service → Settings
2. **Notifications**
3. Add email or Slack webhook
4. Get notified of:
   - Deploy failures
   - Service crashes
   - Health check failures

### Metrics

Free tier includes:
- CPU usage
- Memory usage
- HTTP request count
- Response times

Access: Dashboard → Service → Metrics

---

## 💰 Cost Management

### Free Tier Limits

- ✅ **Price**: $0/month
- ✅ **RAM**: 512 MB
- ⚠️ **Sleep**: After 15 min inactivity
- ⚠️ **Bandwidth**: 100 GB/month
- ⚠️ **Build**: 400 hours/month

### When to Upgrade

Consider Starter plan ($7/mo) if:
- Service sleeps too often (poor UX)
- Need more RAM (memory errors)
- Want custom domain
- Need faster build times

---

## 🔒 Security Checklist

- [ ] `SECRET_KEY` is generated securely (not default)
- [ ] `SECRET_KEY` is never committed to Git
- [ ] `ALLOWED_ORIGINS` only includes your domains
- [ ] `N8N_WEBHOOK_URL` is kept secret
- [ ] Deploy hook URL is in GitHub Secrets only
- [ ] Auto-deploy is disabled (using GitHub Actions)
- [ ] Health check endpoint is configured
- [ ] Rate limiting is enabled and tested

---

## 📚 Additional Resources

- [Render Python Quickstart](https://render.com/docs/deploy-fastapi)
- [Render Environment Variables](https://render.com/docs/environment-variables)
- [Render Deploy Hooks](https://render.com/docs/deploy-hooks)
- [FastAPI Deployment Guide](https://fastapi.tiangolo.com/deployment/)

---

## ✅ Setup Completion Checklist

- [ ] Render account created
- [ ] Web service created and deployed
- [ ] All environment variables configured
- [ ] Health check endpoint working
- [ ] n8n webhook configured
- [ ] Deploy hook URL obtained
- [ ] Deploy hook added to GitHub Secrets
- [ ] Backend URL added to GitHub Secrets
- [ ] ALLOWED_ORIGINS updated with GitHub Pages URL
- [ ] Contact form endpoint tested successfully
- [ ] Rate limiting verified
- [ ] Logs monitored for errors

---

**Setup Time**: ~20-30 minutes
**Status**: Production Ready ✅

**Next Steps**: Deploy frontend to GitHub Pages and test end-to-end!
