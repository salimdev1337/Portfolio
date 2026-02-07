# 🚀 Deployment Checklist - Portfolio Project

**Branch**: `feature/github-actions`
**Status**: Ready for Render Setup
**Deadline**: February 9, 2026

---

## ✅ Completed

- [x] Phase 4: GitHub Actions CI/CD workflows implemented
- [x] Frontend deployment workflow (GitHub Pages)
- [x] Backend deployment workflow (Render)
- [x] PR checks workflow
- [x] GitHub Actions documentation created
- [x] Render setup guides created
- [x] Secret key generator script created
- [x] Environment variables templates created

---

## 📋 Next Steps (In Order)

### Step 1: Set Up n8n Webhook (15 minutes)

**Option A: n8n Cloud (Recommended)**
1. Go to [n8n.io](https://n8n.io) and sign up
2. Create new workflow
3. Add Webhook node
   - Method: POST
   - Path: `portfolio-contact`
4. Add Email Send node
   - To: `salimmtiri17@gmail.com`
   - Subject: `📬 Portfolio Contact: {{$json.form_data.subject}}`
   - Body: Include name, email, message from form
5. Connect nodes and activate workflow
6. Copy webhook URL (looks like: `https://xxx.app.n8n.cloud/webhook/portfolio-contact`)

**Option B: Skip for now**
- Use [webhook.site](https://webhook.site) to get a temporary URL for testing
- Set up real n8n later

---

### Step 2: Deploy Backend to Render (20 minutes)

📖 **Full Guide**: [backend/RENDER_SETUP.md](backend/RENDER_SETUP.md)
⚡ **Quick Guide**: [backend/QUICK_START.md](backend/QUICK_START.md)

**Quick Steps**:

1. **Create Render Account**
   - Go to [render.com](https://render.com)
   - Sign up with GitHub
   - Authorize repository access

2. **Create Web Service**
   - Click **New +** → **Web Service**
   - Select your portfolio repository
   - Configure:
     - Name: `portfolio-backend`
     - Root Directory: `backend`
     - Build Command: `pip install -r requirements.txt`
     - Start Command: `gunicorn app.main:app --workers 2 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:$PORT`
     - Plan: Free

3. **Generate Secret Key**
   ```bash
   cd backend
   python3 scripts/generate_secret.py
   ```
   Copy the output

4. **Add Environment Variables in Render**
   - Settings → Environment → Add Environment Variable
   - Add these (see [backend/.env.render.template](backend/.env.render.template)):
     - `PYTHON_VERSION` = `3.11.0`
     - `SECRET_KEY` = `<from generate_secret.py>`
     - `N8N_WEBHOOK_URL` = `<from n8n>`
     - `ALLOWED_ORIGINS` = `https://yourusername.github.io,http://localhost:5173`
     - `ENVIRONMENT` = `production`
     - `LOG_LEVEL` = `INFO`

5. **Configure Settings**
   - Health Check Path: `/health`
   - Auto-Deploy: No

6. **Deploy**
   - Click **Create Web Service**
   - Wait 3-5 minutes

7. **Test Deployment**
   ```bash
   curl https://your-backend.onrender.com/health
   ```

8. **Get Deploy Hook**
   - Settings → Deploy Hook
   - Copy the URL
   - Save it for next step

**Your Render URL**: `https://portfolio-backend-xxxxx.onrender.com`

---

### Step 3: Configure GitHub Secrets (5 minutes)

📖 **Full Guide**: [.github/SECRETS.md](.github/SECRETS.md)

1. Go to your GitHub repository
2. **Settings** → **Secrets and variables** → **Actions**
3. Add these secrets:

| Secret Name | Value | Where to Get |
|-------------|-------|--------------|
| `BACKEND_API_URL` | `https://your-backend.onrender.com` | From Render (step 2) |
| `RENDER_DEPLOY_HOOK_URL` | `https://api.render.com/deploy/srv-...` | Render Settings → Deploy Hook |
| `GA_TRACKING_ID` | `UA-XXXXXXXXX-X` | Optional: Google Analytics |

---

### Step 4: Enable GitHub Pages (2 minutes)

1. Go to your GitHub repository
2. **Settings** → **Pages**
3. Source: **GitHub Actions**
4. Save

---

### Step 5: Update ALLOWED_ORIGINS (3 minutes)

After you know your GitHub Pages URL:

1. Get your GitHub username
2. Your GitHub Pages URL will be: `https://<username>.github.io`
3. Go to Render → Settings → Environment
4. Update `ALLOWED_ORIGINS`:
   ```
   https://<username>.github.io,http://localhost:5173
   ```
5. Click **Save Changes**

---

### Step 6: Push and Deploy (5 minutes)

1. **Review Changes**
   ```bash
   git status
   git log --oneline -3
   ```

2. **Push to GitHub** (I'll ask for permission first)
   ```bash
   git push -u origin feature/github-actions
   ```

3. **Create Pull Request**
   - Go to GitHub repository
   - Click "Compare & pull request"
   - Review changes
   - Merge to `main`

4. **Watch Deployment**
   - Go to **Actions** tab
   - Watch workflows run
   - Frontend deploys to GitHub Pages
   - Backend deploys to Render

---

### Step 7: Test End-to-End (5 minutes)

1. **Visit your site**: `https://<username>.github.io`

2. **Test contact form**:
   - Fill out form
   - Submit
   - Check for success message

3. **Verify n8n received data**:
   - Check email
   - Or check n8n workflow executions

4. **Test rate limiting**:
   - Submit form 6 times quickly
   - 6th attempt should fail with rate limit error

---

## 🎯 Success Criteria

- [ ] Backend deployed and healthy on Render
- [ ] Frontend deployed to GitHub Pages
- [ ] Contact form submits successfully
- [ ] n8n notifications received
- [ ] Rate limiting works (5 req/hour)
- [ ] No console errors
- [ ] Mobile responsive
- [ ] All tests passing in CI/CD

---

## 🐛 Common Issues

### Backend won't start on Render
- Check start command uses `$PORT` variable
- Verify all environment variables are set
- Check Render logs for Python errors

### Frontend can't reach backend
- Verify `BACKEND_API_URL` in GitHub Secrets
- Check `ALLOWED_ORIGINS` includes GitHub Pages URL
- Test backend health endpoint directly

### n8n not receiving data
- Verify `N8N_WEBHOOK_URL` is correct
- Check n8n workflow is activated
- Test webhook URL directly with curl

### GitHub Actions failing
- Check secrets are set correctly
- Verify Node.js and Python versions
- Review workflow logs in Actions tab

---

## 📚 Documentation Reference

| Document | Purpose |
|----------|---------|
| [backend/RENDER_SETUP.md](backend/RENDER_SETUP.md) | Complete Render setup guide |
| [backend/QUICK_START.md](backend/QUICK_START.md) | 10-minute quick start |
| [.github/SECRETS.md](.github/SECRETS.md) | GitHub secrets configuration |
| [.github/README.md](.github/README.md) | GitHub Actions guide |
| [backend/.env.render.template](backend/.env.render.template) | Environment variables template |

---

## ⏱️ Time Estimates

- n8n setup: 15 minutes
- Render deployment: 20 minutes
- GitHub secrets: 5 minutes
- GitHub Pages: 2 minutes
- Testing: 10 minutes

**Total**: ~1 hour

---

## 🎉 After Deployment

Once everything is live:

1. **Update README** with live links
2. **Test on real devices** (mobile, tablet)
3. **Run Lighthouse audit**
4. **Share on LinkedIn/Twitter**
5. **Monitor for first week**
6. **Fix any issues that come up**

---

**Current Status**: Ready for Step 1 (n8n setup)
**Next Action**: Set up n8n webhook or use webhook.site for testing

Good luck! 🚀
