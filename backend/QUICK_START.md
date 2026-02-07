# Quick Start - Deploy Backend in 10 Minutes

Follow these steps to get your backend live on Render quickly.

## 🚀 Fast Track Setup

### 1. Create Render Account (2 minutes)
- Go to [render.com](https://render.com)
- Sign up with GitHub
- Authorize repository access

### 2. Create Web Service (3 minutes)
1. Click **New +** → **Web Service**
2. Select your portfolio repository
3. Configure:
   - **Name**: `portfolio-backend`
   - **Root Directory**: `backend`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn app.main:app --workers 2 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:$PORT`
   - **Plan**: Free

### 3. Set Environment Variables (3 minutes)

```bash
# Generate secret key first:
cd backend
python3 scripts/generate_secret.py
```

Then add these in Render:

| Variable | Value |
|----------|-------|
| `PYTHON_VERSION` | `3.11.0` |
| `SECRET_KEY` | `<from generate_secret.py>` |
| `N8N_WEBHOOK_URL` | `<your n8n webhook URL>` |
| `ALLOWED_ORIGINS` | `https://yourusername.github.io,http://localhost:5173` |
| `ENVIRONMENT` | `production` |
| `LOG_LEVEL` | `INFO` |

### 4. Configure Settings (1 minute)
- **Health Check Path**: `/health`
- **Auto-Deploy**: No (we use GitHub Actions)

### 5. Deploy! (1 minute)
- Click **Create Web Service**
- Wait 3-5 minutes for deployment

### 6. Test (1 minute)

```bash
# Replace with your actual URL
curl https://your-backend.onrender.com/health
```

Expected response:
```json
{
  "status": "healthy",
  "version": "1.0.0",
  "environment": "production",
  "n8n_configured": true
}
```

### 7. Get Deploy Hook (1 minute)
1. Settings → Deploy Hook
2. Copy URL
3. Add to GitHub Secrets as `RENDER_DEPLOY_HOOK_URL`

## ✅ Done!

Your backend is now:
- ✅ Deployed to Render
- ✅ Accessible via HTTPS
- ✅ Ready for GitHub Actions CI/CD
- ✅ Integrated with n8n webhook

---

## 🆘 Quick Troubleshooting

**Build fails?**
→ Check `requirements.txt` exists and is valid

**Won't start?**
→ Verify start command uses `$PORT` variable

**Environment variables?**
→ No quotes around values, exact variable names

**Need help?**
→ See [RENDER_SETUP.md](./RENDER_SETUP.md) for detailed guide

---

**Next**: Deploy frontend to GitHub Pages and connect the two!
