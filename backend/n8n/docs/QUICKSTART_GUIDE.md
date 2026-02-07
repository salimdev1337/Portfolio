# 🚀 Quick Start: n8n Setup for Portfolio Contact Form

**Complete step-by-step guide to get your contact form notifications working in 30 minutes!**

---

## 📋 What You'll Set Up

By the end of this guide, you'll have:
- ✅ n8n workflow running
- ✅ Email notifications (to you)
- ✅ Auto-response emails (to users)
- ✅ Slack notifications (optional)
- ✅ WhatsApp notifications (optional)
- ✅ Connected to your backend

---

## Part 1: Set Up n8n

### Option A: n8n Cloud (Easiest - 5 minutes)

**Pros:** No setup, free tier available, automatic updates
**Cons:** Limited free executions (200/month)

1. **Create Account**
   ```
   1. Go to https://n8n.cloud
   2. Click "Get started for free"
   3. Sign up with email or Google
   4. Verify email
   ```

2. **Create Workspace**
   ```
   1. Name: "Portfolio Automation"
   2. Region: Choose closest to you
   3. Click "Create"
   ```

3. **Done!** → Skip to Part 2

### Option B: Self-Hosted with Docker (Free Forever - 10 minutes)

**Pros:** Unlimited executions, full control
**Cons:** Requires server/VPS

1. **Install Docker** (if not already installed)
   ```bash
   # Ubuntu/Debian
   curl -fsSL https://get.docker.com -o get-docker.sh
   sudo sh get-docker.sh

   # Mac
   # Download from: https://www.docker.com/products/docker-desktop

   # Windows
   # Download from: https://www.docker.com/products/docker-desktop
   ```

2. **Run n8n**
   ```bash
   docker run -d \
     --name n8n \
     -p 5678:5678 \
     -e N8N_BASIC_AUTH_ACTIVE=true \
     -e N8N_BASIC_AUTH_USER=admin \
     -e N8N_BASIC_AUTH_PASSWORD=your-secure-password-here \
     -v ~/.n8n:/home/node/.n8n \
     n8nio/n8n
   ```

3. **Access n8n**
   ```
   Open browser: http://localhost:5678
   Login: admin / your-secure-password-here
   ```

---

## Part 2: Import Workflow

1. **Download Workflow**
   ```bash
   # File is already in your project:
   backend/n8n/workflows/portfolio-contact-form.json
   ```

2. **Import into n8n**
   ```
   1. In n8n dashboard, click "Workflows" in sidebar
   2. Click "+ New workflow" (top right)
   3. Click the three dots (⋯) menu → "Import from file"
   4. Select: backend/n8n/workflows/portfolio-contact-form.json
   5. Click "Import"
   ```

3. **Save Workflow**
   ```
   1. Click "Save" (top right)
   2. Name it: "Portfolio Contact Form"
   ```

You should now see the workflow with several nodes connected!

---

## Part 3: Configure Email Notifications

### Option A: Gmail (Best for Testing - 10 minutes)

**Requirements:**
- Gmail account
- 2-Factor Authentication enabled

**Setup:**

1. **Enable 2FA on Gmail**
   ```
   1. Go to: https://myaccount.google.com/security
   2. Click "2-Step Verification"
   3. Follow steps to enable
   ```

2. **Generate App Password**
   ```
   1. Go to: https://myaccount.google.com/apppasswords
   2. App: "Mail"
   3. Device: "Other (Custom name)"
   4. Name: "n8n Portfolio"
   5. Click "Generate"
   6. Copy the 16-character password (example: "abcd efgh ijkl mnop")
   ```
   acfn dmca qsen moll
re_Qo7uexRS_94tNyRPV68ZNTz77PAega33s

3. **Configure in n8n - Notification Email**
   ```
   1. In workflow, click "Send Notification Email" node
   2. Click "Credential for SMTP" dropdown
   3. Click "+ Create New Credential"
   4. Fill in:
      - User: your-gmail@gmail.com
      - Password: [paste 16-char app password - no spaces]
      - Host: smtp.gmail.com
      - Port: 587
      - SSL/TLS: Enable (toggle on)
   5. Click "Save"
   ```

4. **Configure in n8n - Auto-Response Email**
   ```
   1. Click "Send Auto-Response" node
   2. Click "Credential for SMTP" dropdown
   3. Select the credential you just created
   4. Click "Save"
   ```

5. **Update Email Addresses**
   ```
   In "Send Notification Email" node:
   - From Email: noreply@yourdomain.com (or your Gmail)
   - To Email: salimmtiri17@gmail.com (YOUR email)

   In "Send Auto-Response" node:
   - From Email: salim@yourdomain.com (or your Gmail)
   - To Email: {{ $json.email }} (leave as is - dynamic)
   ```

### Option B: SendGrid (Best for Production - 15 minutes)

**Why SendGrid:**
- ✅ Free tier: 100 emails/day
- ✅ Better deliverability
- ✅ Email analytics
- ✅ No 2FA hassle

**Setup:**

1. **Create SendGrid Account**
   ```
   1. Go to: https://signup.sendgrid.com
   2. Sign up for free account
   3. Verify email
   4. Complete onboarding (select "Developer" plan)
   ```

2. **Generate API Key**
   ```
   1. Go to: Settings → API Keys
   2. Click "Create API Key"
   3. Name: "n8n Portfolio Automation"
   4. Permissions: "Full Access" or "Mail Send"
   5. Click "Create & View"
   6. Copy API key (starts with "SG.")
   ```

3. **Configure in n8n**
   ```
   In both email nodes:
   - User: apikey (literally type "apikey")
   - Password: [paste SendGrid API key]
   - Host: smtp.sendgrid.net
   - Port: 587
   - SSL/TLS: Enable
   ```

4. **Verify Sender Email** (Important!)
   ```
   1. In SendGrid: Settings → Sender Authentication
   2. Click "Verify a Single Sender"
   3. Fill in your details:
      - From Name: Salim Mtiri
      - From Email: salim@yourdomain.com (or your email)
   4. Verify email
   5. Use this email in "From Email" field in n8n
   ```

---

## Part 4: Add Slack Notifications (Optional - 10 minutes)

1. **Create Slack Workspace** (if you don't have one)
   ```
   1. Go to: https://slack.com/create
   2. Enter email
   3. Create workspace name: "Portfolio Notifications"
   4. Create channel: #contact-leads
   ```

2. **Create Slack App**
   ```
   1. Go to: https://api.slack.com/apps
   2. Click "Create New App"
   3. Choose "From scratch"
   4. App Name: "Portfolio Contact Bot"
   5. Workspace: Select your workspace
   6. Click "Create App"
   ```

3. **Add Permissions**
   ```
   1. In sidebar: OAuth & Permissions
   2. Scroll to "Scopes" → "Bot Token Scopes"
   3. Click "Add an OAuth Scope"
   4. Add these scopes:
      - chat:write
      - chat:write.public
   5. Click "Save"
   ```

4. **Install to Workspace**
   ```
   1. Scroll up to "OAuth Tokens"
   2. Click "Install to Workspace"
   3. Click "Allow"
   4. Copy "Bot User OAuth Token" (starts with "xoxb-")
   ```

5. **Configure in n8n**
   ```
   1. In workflow, find "Slack Notification (Optional)" node
   2. Click on it
   3. Toggle "Disabled" to enable it (should turn green)
   4. Click "Credential for Slack API" dropdown
   5. Create new credential:
      - OAuth Token: [paste xoxb- token]
   6. Update settings:
      - Channel: #contact-leads
      - Text: (already configured with nice format)
   7. Click "Save"
   ```

---

## Part 5: Add WhatsApp Notifications (Optional - 20 minutes)

### Option A: Twilio (Official WhatsApp API)

**Requirements:**
- Phone number for receiving messages
- $20 credit (Twilio gives you trial credit)

**Setup:**

1. **Create Twilio Account**
   ```
   1. Go to: https://www.twilio.com/try-twilio
   2. Sign up for free account
   3. Verify your phone number
   4. Get $20 trial credit
   ```

2. **Set Up WhatsApp Sandbox**
   ```
   1. In Twilio Console: Messaging → Try it out → Send a WhatsApp message
   2. Click "Send a message"
   3. Follow instructions to join sandbox:
      - Send WhatsApp message to shown number
      - Message: "join [your-code]"
   4. You'll receive confirmation
   ```

3. **Get Credentials**
   ```
   1. Go to: Console → Account → Keys & Credentials
   2. Copy:
      - Account SID (starts with "AC...")
      - Auth Token (click to reveal)
   3. Go to: Phone Numbers → Manage → Active numbers
   4. Copy: WhatsApp Sandbox number (e.g., "+1 415 523 8886")
   ```

4. **Add to n8n**
   ```
   1. In n8n, click "+" to add new node
   2. Search "Twilio"
   3. Select "Twilio" node
   4. Place it next to Slack node
   5. Configure:
      - Resource: Message
      - Operation: Send
      - From: whatsapp:+14155238886 (your sandbox number)
      - To: whatsapp:+212XXXXXXXXX (your WhatsApp number with country code)
      - Message: Use this template:
   ```

   **Message Template:**
   ```
   🎯 *New Portfolio Contact*

   👤 From: {{ $json.name }}
   📧 Email: {{ $json.email }}
   📋 Subject: {{ $json.subject }}
   ⭐ Rating: {{ $json.rating }}/5

   💬 Message:
   {{ $json.message }}

   ━━━━━━━━━━━━━━━━━━━━━
   🕐 {{ $json.timestamp }}
   🔑 Request ID: {{ $json.request_id }}
   ```

5. **Connect the Node**
   ```
   1. Click "Extract Form Data" node
   2. Drag from output dot to Twilio node
   3. Click "Save"
   ```

### Option B: WhatsApp Business API (More Complex)

For production use with verified business account - see Twilio or Meta documentation.

---

## Part 6: Get Webhook URL & Connect Backend

1. **Get Webhook URL from n8n**
   ```
   1. In workflow, click "Webhook" node (first node)
   2. Look for "Webhook URLs" section
   3. Copy the "Production URL"
      Example: https://your-n8n-instance.app.n8n.cloud/webhook/abc123xyz
   ```

2. **Add to Backend Environment**
   ```bash
   # Edit backend/.env file
   nano backend/.env

   # Add this line (replace with YOUR webhook URL):
   N8N_WEBHOOK_URL=https://your-n8n-instance.app.n8n.cloud/webhook/abc123xyz
   ```

3. **Generate Webhook Secret (Security)**
   ```bash
   # Generate secure secret
   python -c "import secrets; print(secrets.token_hex(32))"

   # Copy the output (64 characters)
   # Example: a1b2c3d4e5f6...

   # Add to backend/.env:
   N8N_WEBHOOK_SECRET=a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456
   ```

4. **Activate n8n Workflow**
   ```
   1. In n8n, click "Active" toggle (top right)
   2. Should turn green and say "Active"
   ```

5. **Restart Backend**
   ```bash
   cd backend
   source venv/bin/activate
   uvicorn app.main:app --reload
   ```

---

## Part 7: Test Everything! 🧪

### Test 1: Backend Health Check

```bash
# Check if backend can reach n8n
curl http://localhost:8000/api/webhook/health
```

**Expected Response:**
```json
{
  "healthy": true,
  "webhook_url": "https://***",
  "response_time_ms": 234,
  "status_code": 200,
  "details": {
    "signature_enabled": true,
    "timeout_seconds": 10
  }
}
```

### Test 2: Submit Test Contact Form

```bash
curl -X POST http://localhost:8000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "subject": "Test Notification",
    "message": "Testing the complete workflow!",
    "rating": 5
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Thank you! Your message has been sent successfully.",
  "request_id": "abc123xyz..."
}
```

### Test 3: Check What You Should Receive

**Within 30 seconds, you should get:**

1. ✅ **Notification Email** (to salimmtiri17@gmail.com)
   - Dark themed
   - Shows all contact details
   - Has "Reply to Test User" button

2. ✅ **Auto-Response Email** (to test@example.com)
   - Light themed
   - Confirms receipt
   - Shows response time

3. ✅ **Slack Message** (if enabled)
   - In #contact-leads channel
   - Formatted notification

4. ✅ **WhatsApp Message** (if enabled)
   - To your WhatsApp number
   - Formatted notification

### Test 4: Check n8n Execution

```
1. In n8n: Click "Executions" in sidebar
2. Should see "Succeeded" execution
3. Click on it to see details
4. Verify all nodes executed successfully (green checkmarks)
```

---

## Part 8: Add HTML Email Templates (Optional - Better Design!)

The workflow uses plain text emails by default. For beautiful HTML emails:

1. **Open Email Nodes**
   ```
   1. Click "Send Notification Email" node
   2. Find "Content" section
   3. Change from "Text" to "HTML"
   ```

2. **Paste HTML Template**
   ```
   1. Open: backend/n8n/templates/notification-email.html
   2. Copy ENTIRE file content
   3. Paste into HTML field in n8n
   4. Click "Save"
   ```

3. **Repeat for Auto-Response**
   ```
   1. Click "Send Auto-Response" node
   2. Change to HTML mode
   3. Paste: backend/n8n/templates/auto-response-email.html
   4. Click "Save"
   ```

4. **Test Again**
   - Send another test contact form
   - Emails should now be beautifully designed!

---

## Part 9: Add Webhook Security (Recommended!)

Prevent unauthorized webhook calls:

1. **In n8n, Add Function Node**
   ```
   1. Click "+" between "Webhook" and "Extract Form Data"
   2. Search "Function"
   3. Select "Function" node
   4. Name it: "Verify Signature"
   ```

2. **Add Verification Code**
   ```javascript
   // Paste this code in the Function node:

   const WEBHOOK_SECRET = 'paste-your-webhook-secret-here';

   const receivedSignature = $('Webhook').first().json.headers['x-webhook-signature'];
   const payload = $('Webhook').first().json.body;

   if (!receivedSignature) {
     throw new Error('Missing webhook signature');
   }

   const crypto = require('crypto');
   const canonicalPayload = JSON.stringify(payload, Object.keys(payload).sort());
   const expectedSignature = crypto
     .createHmac('sha256', WEBHOOK_SECRET)
     .update(canonicalPayload)
     .digest('hex');

   if (!crypto.timingSafeEqual(
     Buffer.from(receivedSignature),
     Buffer.from(expectedSignature)
   )) {
     throw new Error('Invalid signature');
   }

   return $input.all();
   ```

3. **Update Secret**
   - Replace `paste-your-webhook-secret-here` with your actual secret from backend/.env

4. **Reconnect Nodes**
   ```
   Webhook → Verify Signature → Extract Form Data → ...
   ```

5. **Save and Test**
   - Invalid requests will be rejected
   - Only signed requests from your backend will work

---

## 🎯 Troubleshooting

### Issue: "Webhook URL returns 404"

**Fix:**
```
1. Check workflow is Active (green toggle)
2. Copy webhook URL again from Webhook node
3. Make sure it matches exactly in backend/.env
4. Restart backend server
```

### Issue: "Emails not sending"

**Fix:**
```
Gmail:
1. Verify 2FA is enabled
2. App password is correct (16 chars, no spaces)
3. Check Gmail spam folder
4. Try test in n8n node directly

SendGrid:
1. Verify sender email is confirmed
2. API key has mail send permission
3. Check SendGrid Activity dashboard
```

### Issue: "Slack not posting"

**Fix:**
```
1. Verify bot token starts with "xoxb-"
2. Check channel name is correct (#contact-leads)
3. Ensure bot was added to channel:
   - In Slack: type /invite @Portfolio Contact Bot
```

### Issue: "WhatsApp not sending"

**Fix:**
```
1. Verify you joined Twilio sandbox
2. Check phone number format: whatsapp:+212XXXXXXXXX
3. Ensure trial credit is available
4. Check Twilio console for errors
```

### Issue: "Rate limited"

**Fix:**
```bash
# Temporarily increase for testing
echo "RATE_LIMIT_PER_HOUR=100" >> backend/.env

# Restart backend
```

---

## ✅ Final Checklist

Before going live:

- [ ] n8n workflow imported and active
- [ ] Email credentials configured (Gmail or SendGrid)
- [ ] Test emails received successfully
- [ ] Webhook URL added to backend/.env
- [ ] Webhook secret generated and configured
- [ ] Backend restarted and healthy
- [ ] Health check passes
- [ ] Test contact form works
- [ ] Slack configured (if using)
- [ ] WhatsApp configured (if using)
- [ ] HTML email templates added (optional)
- [ ] Signature verification enabled (recommended)

---

## 🚀 You're Live!

Your portfolio contact form is now fully automated!

**What happens when someone contacts you:**
1. They fill form on your portfolio
2. Backend validates and forwards to n8n
3. You get notification email
4. They get auto-response
5. You get Slack/WhatsApp alert (if enabled)
6. All tracked with request ID

**Response time:** ~2-3 seconds from form submit to email inbox! ⚡

---

## 📚 Next Steps

- **Monitor:** Check n8n executions regularly
- **Optimize:** Adjust email content based on feedback
- **Scale:** Add more integrations (Discord, Google Sheets)
- **Analyze:** Track which emails get best response rates

---

## 🆘 Need Help?

- **Documentation:** backend/n8n/docs/N8N_SETUP_GUIDE.md
- **Security:** backend/n8n/docs/WEBHOOK_SECURITY.md
- **Email Templates:** backend/n8n/templates/README.md
- **GitHub Issues:** https://github.com/salimdev1337/Portfolio/issues

---

**Good luck with your portfolio! 🎮💻**

_Last Updated: February 6, 2026_
