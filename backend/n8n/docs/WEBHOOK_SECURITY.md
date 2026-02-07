# Webhook Signature Verification Guide

Secure your n8n webhooks using HMAC-SHA256 signature verification.

---

## 🔒 Why Webhook Security?

Without signature verification, anyone who discovers your webhook URL could:
- ❌ Send fake contact form submissions
- ❌ Spam your email inbox
- ❌ Flood your n8n workflow with requests
- ❌ Trigger unwanted notifications

With signature verification:
- ✅ Only authenticated requests from your backend are processed
- ✅ Tampering with requests is detected and rejected
- ✅ Replay attacks are prevented (with timestamp checking)
- ✅ Confidence that data is from your legitimate source

---

## 🛠️ Setup

### Step 1: Generate Webhook Secret

```bash
# In your backend directory
cd backend

# Generate a cryptographically secure secret
python -c "import secrets; print(secrets.token_hex(32))"

# Example output:
# a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456
```

### Step 2: Configure Backend

Add the secret to your backend `.env` file:

```bash
# backend/.env
N8N_WEBHOOK_SECRET=a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456
```

Restart your backend server:

```bash
uvicorn app.main:app --reload
```

### Step 3: Test Signature Generation

```bash
# Test that signatures are being generated
curl -X POST http://localhost:8000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "subject": "Test",
    "message": "Testing signature",
    "rating": 5
  }'

# Check backend logs - you should see:
# "Generated webhook signature: a1b2c3d4..."
```

---

## 🔐 How It Works

### Signature Generation (Backend)

1. **Payload Creation**: Backend creates JSON payload with form data
2. **Canonical JSON**: Payload is converted to canonical JSON (sorted keys, no spaces)
3. **HMAC Generation**: HMAC-SHA256 hash is computed using the secret
4. **Header Addition**: Signature is added to `X-Webhook-Signature` header
5. **Request Sent**: POST request sent to n8n with signature

```python
# Simplified algorithm
import hmac
import hashlib
import json

payload = {"name": "John", "email": "john@example.com"}
canonical = json.dumps(payload, sort_keys=True, separators=(',', ':'))
signature = hmac.new(
    secret.encode(),
    canonical.encode(),
    hashlib.sha256
).hexdigest()
```

### Signature Verification (n8n)

1. **Extract Signature**: Get signature from `X-Webhook-Signature` header
2. **Recompute Signature**: Calculate expected signature from payload
3. **Compare**: Use constant-time comparison to prevent timing attacks
4. **Accept/Reject**: Process request only if signatures match

---

## 📋 Implementing in n8n

### Option 1: Function Node (Recommended)

Add this node **after** the Webhook node and **before** any processing:

1. **Add Function Node**:
   - In your workflow, click **+** after the Webhook node
   - Select **Code** → **Function**
   - Name it: "Verify Webhook Signature"

2. **Add Verification Code**:

```javascript
// Get the webhook secret from environment or hardcode it
const WEBHOOK_SECRET = 'a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456';

// Get signature from header
const receivedSignature = $('Webhook').first().json.headers['x-webhook-signature'];

// Get the payload (body)
const payload = $('Webhook').first().json.body;

// If no secret configured, skip verification
if (!WEBHOOK_SECRET || WEBHOOK_SECRET === '') {
  return $input.all();
}

// If no signature received, reject
if (!receivedSignature) {
  throw new Error('Missing webhook signature');
}

// Calculate expected signature
const crypto = require('crypto');
const canonicalPayload = JSON.stringify(payload, Object.keys(payload).sort(), null, 0)
  .replace(/\s+/g, '');  // Remove all whitespace

const expectedSignature = crypto
  .createHmac('sha256', WEBHOOK_SECRET)
  .update(canonicalPayload)
  .digest('hex');

// Constant-time comparison
if (!crypto.timingSafeEqual(
  Buffer.from(receivedSignature),
  Buffer.from(expectedSignature)
)) {
  throw new Error('Invalid webhook signature');
}

// Signature valid - pass data through
return $input.all();
```

3. **Connect Nodes**:
   ```
   Webhook → Verify Signature → Extract Data → Send Emails
   ```

### Option 2: HTTP Request Node Validation

For more complex setups, use an HTTP Request node to call a verification service.

### Option 3: Skip Verification (Development Only)

For testing, you can temporarily disable verification by not setting `N8N_WEBHOOK_SECRET` in your backend `.env`.

**⚠️ Never deploy to production without signature verification!**

---

## 🧪 Testing Signature Verification

### Valid Request Test

```bash
# This should succeed (signature will be automatically generated)
curl -X POST http://localhost:8000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Valid Test",
    "email": "valid@example.com",
    "subject": "Valid Signature Test",
    "message": "This should work",
    "rating": 5
  }'
```

Check n8n execution log - should show **success**.

### Invalid Signature Test

```bash
# Manually send request to n8n with invalid signature
curl -X POST https://your-n8n-instance.com/webhook/portfolio-contact \
  -H "Content-Type: application/json" \
  -H "X-Webhook-Signature: invalid-signature-12345" \
  -d '{
    "request_id": "test-123",
    "timestamp": "2026-02-06T12:00:00Z",
    "form_data": {
      "name": "Hacker",
      "email": "hacker@evil.com",
      "subject": "Invalid Request",
      "message": "This should be rejected",
      "rating": 1
    }
  }'
```

Check n8n execution log - should show **error: "Invalid webhook signature"**.

### No Signature Test

```bash
# Send request without signature header
curl -X POST https://your-n8n-instance.com/webhook/portfolio-contact \
  -H "Content-Type: application/json" \
  -d '{
    "request_id": "test-456",
    "form_data": {
      "name": "No Signature",
      "email": "test@example.com"
    }
  }'
```

Should be rejected with error: "Missing webhook signature".

---

## 🔍 Debugging

### Backend Not Generating Signatures

**Check:**
1. `N8N_WEBHOOK_SECRET` is set in `.env`
2. Secret is at least 32 characters (64 hex chars)
3. Backend server was restarted after adding secret
4. Check logs for "Generated webhook signature" message

```bash
# Check if secret is loaded
cd backend
python -c "from app.config import settings; print(f'Secret configured: {bool(settings.n8n_webhook_secret)}')"
```

### n8n Rejecting Valid Signatures

**Check:**
1. Secret in n8n Function node matches backend secret exactly
2. No whitespace in secret (trim it)
3. Payload canonicalization is identical
4. Using correct header name: `x-webhook-signature` (lowercase)

```javascript
// Debug in n8n Function node
console.log('Received signature:', receivedSignature);
console.log('Expected signature:', expectedSignature);
console.log('Match:', receivedSignature === expectedSignature);
```

### Signature Changes on Retry

**Issue**: Each retry attempt generates a new timestamp, changing the signature.

**Solution**: Backend automatically includes the same signature for all retry attempts (signature is generated once before the retry loop).

---

## 🛡️ Security Best Practices

### 1. Strong Secrets

✅ **Do:**
- Generate secrets with `secrets.token_hex(32)` (64 characters)
- Use different secrets for development and production
- Store secrets in environment variables, never in code

❌ **Don't:**
- Use short secrets ("secret123")
- Reuse secrets across projects
- Commit secrets to Git

### 2. Secret Rotation

Rotate webhook secrets periodically (every 90 days):

```bash
# Generate new secret
NEW_SECRET=$(python -c "import secrets; print(secrets.token_hex(32))")

# Update backend .env
echo "N8N_WEBHOOK_SECRET=$NEW_SECRET" >> backend/.env

# Update n8n Function node with new secret

# Restart backend
# Backend will now sign with new secret
```

### 3. Timestamp Validation (Optional)

Add timestamp checking to prevent replay attacks:

```javascript
// In n8n Function node, add after signature verification:

const timestamp = payload.timestamp;
const now = new Date().toISOString();
const maxAge = 5 * 60 * 1000; // 5 minutes in milliseconds

const timeDiff = new Date(now) - new Date(timestamp);

if (timeDiff > maxAge) {
  throw new Error('Webhook request expired (timestamp too old)');
}

if (timeDiff < -60000) {  // -1 minute
  throw new Error('Webhook request timestamp is in the future');
}
```

### 4. Request ID Tracking

Log request IDs for debugging and auditing:

```javascript
// In n8n, log the request ID
const requestId = payload.request_id;
console.log(`Processing request: ${requestId}`);

// Store in Google Sheets or database for audit trail
```

### 5. Rate Limiting

Even with signatures, implement rate limiting in n8n:

```javascript
// In n8n Function node
const redis = require('redis');
const client = redis.createClient();

const email = payload.form_data.email;
const key = `ratelimit:${email}`;

const count = await client.incr(key);
if (count === 1) {
  await client.expire(key, 3600); // 1 hour
}

if (count > 5) {
  throw new Error('Rate limit exceeded');
}
```

---

## 📊 Monitoring

### Successful Verifications

Log successful verifications:

```javascript
// In n8n Function node
console.log('✅ Webhook signature verified', {
  request_id: payload.request_id,
  timestamp: payload.timestamp,
  from: payload.form_data.email
});
```

### Failed Verifications

Alert on failed verifications (possible attack):

```javascript
// In n8n, add error handling
try {
  // ... signature verification code ...
} catch (error) {
  // Log the failure
  console.error('❌ Webhook signature verification failed', {
    error: error.message,
    received_signature: receivedSignature,
    ip: $('Webhook').first().json.headers['x-forwarded-for']
  });

  // Send alert (optional)
  // ... send Discord/Slack notification ...

  throw error;  // Reject the request
}
```

---

## 🔗 Additional Resources

- [HMAC Algorithm](https://en.wikipedia.org/wiki/HMAC)
- [Webhook Security Best Practices](https://webhooks.fyi/security/hmac)
- [n8n Function Node Docs](https://docs.n8n.io/code-examples/methods-variables/)
- [Timing Attack Prevention](https://codahale.com/a-lesson-in-timing-attacks/)

---

## ✅ Security Checklist

Before deploying to production:

- [ ] Webhook secret generated (64 characters)
- [ ] Secret added to backend `.env`
- [ ] Secret added to n8n Function node
- [ ] Verification Function node added to workflow
- [ ] Valid signature test passed
- [ ] Invalid signature test rejected
- [ ] No signature test rejected
- [ ] Logs show verification success/failure
- [ ] Timestamp validation enabled (optional)
- [ ] Rate limiting configured (optional)
- [ ] Monitoring/alerting set up

---

**Security Level**: 🛡️🛡️🛡️🛡️ High
**Complexity**: ⭐⭐⭐ Medium
**Setup Time**: ~15 minutes

**Last Updated:** February 6, 2026
