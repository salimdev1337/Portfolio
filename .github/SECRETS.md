# GitHub Secrets Configuration

This document outlines all the GitHub secrets that need to be configured for the CI/CD pipelines to work correctly.

## How to Add Secrets

1. Go to your repository on GitHub
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add each secret listed below

---

## Required Secrets

### Frontend Deployment Secrets

#### `BACKEND_API_URL`
- **Description**: URL of the deployed backend API on Render
- **Example**: `https://portfolio-backend-abc123.onrender.com`
- **Used by**: `frontend-deploy.yml`
- **Required**: Yes

#### `GA_TRACKING_ID` (Optional)
- **Description**: Google Analytics tracking ID
- **Example**: `UA-123456789-1` or `G-XXXXXXXXXX`
- **Used by**: `frontend-deploy.yml`
- **Required**: No (optional for analytics)

---

### Backend Deployment Secrets

#### `RENDER_DEPLOY_HOOK_URL`
- **Description**: Render deploy hook URL for triggering deployments
- **How to get**:
  1. Go to your Render dashboard
  2. Select your web service
  3. Navigate to **Settings** → **Deploy Hook**
  4. Copy the webhook URL
- **Example**: `https://api.render.com/deploy/srv-xxxxxxxxxxxxx?key=xxxxxxxxxxxxxxxx`
- **Used by**: `backend-deploy.yml`
- **Required**: Yes

#### `BACKEND_API_URL`
- **Description**: URL of the deployed backend API (same as frontend secret)
- **Example**: `https://portfolio-backend-abc123.onrender.com`
- **Used by**: `backend-deploy.yml` (for health checks)
- **Required**: Yes

---

## Environment-Specific Variables

The following environment variables are configured **on Render** (not GitHub):

### Render Environment Variables

Set these in your Render dashboard under **Environment** → **Environment Variables**:

1. **`SECRET_KEY`**
   - Description: Secret key for API security
   - How to generate: `python -c "import secrets; print(secrets.token_hex(32))"`
   - Required: Yes
   - Auto-generate: Yes (Render can generate this)

2. **`N8N_WEBHOOK_URL`**
   - Description: n8n webhook URL for contact form submissions
   - Example: `https://your-n8n-instance.app.n8n.cloud/webhook/portfolio-contact`
   - Required: Yes
   - Sync: No (manual entry)

3. **`ALLOWED_ORIGINS`**
   - Description: Comma-separated list of allowed CORS origins
   - Example: `https://yourusername.github.io,http://localhost:5173`
   - Required: Yes
   - Sync: No (manual entry)

4. **`ENVIRONMENT`**
   - Description: Deployment environment
   - Value: `production`
   - Required: Yes

5. **`LOG_LEVEL`**
   - Description: Logging level
   - Value: `INFO`
   - Required: No (defaults to INFO)

6. **`RATE_LIMIT_PER_HOUR`**
   - Description: Rate limit for contact form (requests per hour per IP)
   - Value: `5`
   - Required: No (defaults to 5)

---

## Verification Checklist

After adding all secrets, verify:

- [ ] `BACKEND_API_URL` is set in GitHub Secrets
- [ ] `RENDER_DEPLOY_HOOK_URL` is set in GitHub Secrets
- [ ] `GA_TRACKING_ID` is set (if using analytics)
- [ ] All environment variables are set in Render
- [ ] Render service is configured with correct build/start commands
- [ ] GitHub Pages is enabled and set to "GitHub Actions" source

---

## Testing Secrets

To test if secrets are configured correctly:

1. **Frontend Deployment**:
   ```bash
   # Check if VITE_API_URL is being injected
   npm run build
   # Check dist/assets/*.js for the API URL
   ```

2. **Backend Deployment**:
   ```bash
   # Trigger a test deployment
   curl -X POST "$RENDER_DEPLOY_HOOK_URL"

   # Wait 60 seconds, then check health
   curl https://your-backend-url.onrender.com/health
   ```

3. **CI/CD Pipeline**:
   - Push a commit to main branch
   - Check Actions tab in GitHub
   - Verify all workflows complete successfully

---

## Security Best Practices

1. **Never commit secrets to the repository**
2. **Rotate secrets periodically** (every 3-6 months)
3. **Use different secrets for staging/production**
4. **Limit secret access** to necessary team members only
5. **Monitor secret usage** in GitHub Actions logs

---

## Troubleshooting

### "Secret not found" error
- Verify secret name matches exactly (case-sensitive)
- Check that secret is set at repository level, not organization

### Backend deployment fails
- Verify `RENDER_DEPLOY_HOOK_URL` is correct
- Check Render service is active and not paused
- Verify environment variables are set in Render

### Frontend can't connect to backend
- Verify `BACKEND_API_URL` matches Render deployment URL
- Check CORS settings in backend allow frontend origin
- Verify backend is healthy: `curl https://backend-url/health`

---

**Last Updated**: February 7, 2026
**Maintained By**: Portfolio Development Team
