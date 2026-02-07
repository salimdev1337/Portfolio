# Email Templates

Professional HTML email templates for portfolio contact form notifications.

## 📧 Templates

### 1. `notification-email.html`
**Purpose:** Notifies you when someone submits the contact form

**Features:**
- Dark retro theme matching portfolio aesthetic
- Clean layout with all contact details
- Direct reply button
- Metadata tracking (timestamp, request ID)
- Responsive design

**Preview:**
- Header: Neon cyan gradient with bold title
- Contact info section with labels
- Message in monospace box
- Reply button linking to email
- Footer with portfolio links

### 2. `auto-response-email.html`
**Purpose:** Sends automatic confirmation to the person who filled the form

**Features:**
- Light, professional theme
- Friendly greeting with personalization
- Submission confirmation details
- Response time expectations
- Direct contact information
- Social links
- Pro tip with easter egg hint

**Preview:**
- Header: Blue gradient with sparkle emoji
- Personalized greeting
- Submission details box
- Response time highlight
- Signature with social links
- Friendly footer

## 🎨 Theme Colors

### Notification Email (Dark Theme)
```css
Background: #1A1A1A
Container: #2C2C2C
Primary: #00D9FF (Neon cyan)
Accent: #00FF88 (Matrix green)
Text: #E0E0E0
```

### Auto-Response (Light Theme)
```css
Background: #F0F0F0
Container: #FFFFFF
Primary: #4A9EFF (Retro blue)
Accent: #2E7FDD (Darker blue)
Text: #1A1A1A
```

## 🔧 Using in n8n

### Option 1: HTML Content (Recommended)

1. Open your n8n workflow
2. Click on email node (Send Notification Email or Send Auto-Response)
3. Switch from "Text" to "HTML" mode
4. Copy the entire HTML content from the template file
5. Paste into the HTML field
6. n8n will automatically replace `{{ $json.variable }}` with actual values

### Option 2: External HTML Files

1. Host templates on a server or CDN
2. In n8n, use HTTP Request node to fetch HTML
3. Pass fetched HTML to email node

### Variables Used

Both templates use these n8n variables:
- `{{ $json.name }}` - Sender's name
- `{{ $json.email }}` - Sender's email
- `{{ $json.subject }}` - Message subject
- `{{ $json.message }}` - Message content
- `{{ $json.rating }}` - Rating (1-5)
- `{{ $json.timestamp }}` - Submission timestamp
- `{{ $json.request_id }}` - Unique request identifier

## ✅ Testing Templates

### Test with Sample Data

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Project Collaboration",
  "message": "Hi Salim, I'd love to collaborate on a project...",
  "rating": 5,
  "timestamp": "2026-02-06T12:30:00Z",
  "request_id": "abc123xyz"
}
```

### Email Client Testing

Test in multiple email clients:
- [ ] Gmail (Desktop)
- [ ] Gmail (Mobile)
- [ ] Outlook
- [ ] Apple Mail
- [ ] Thunderbird
- [ ] Mobile devices (iOS/Android)

### Rendering Issues?

Common fixes:
1. **Inline CSS**: Most email clients require inline CSS
2. **Table layouts**: Some clients need table-based layouts for complex designs
3. **Web fonts**: Not all clients support custom fonts (fallback to monospace)
4. **Dark mode**: Some clients override dark backgrounds

## 🎨 Customization Guide

### Changing Colors

**Notification Email (Dark Theme):**
```css
/* Find and replace in notification-email.html */
#00D9FF → Your primary color
#00FF88 → Your accent color
#1A1A1A → Your background
#2C2C2C → Your container color
```

**Auto-Response (Light Theme):**
```css
/* Find and replace in auto-response-email.html */
#4A9EFF → Your primary color
#2E7FDD → Your darker primary
#F0F0F0 → Your background
#FFFFFF → Your container color
```

### Adding Your Logo

```html
<!-- Add in header section -->
<div class="header">
    <img src="https://yourdomain.com/logo.png"
         alt="Logo"
         style="max-width: 150px; margin-bottom: 16px;">
    <h1>NEW CONTACT RECEIVED</h1>
</div>
```

### Changing Fonts

```css
/* Replace in <style> section */
font-family: 'Courier New', Courier, monospace;

/* With your preferred font */
font-family: 'Press Start 2P', 'Roboto Mono', monospace;
```

### Adding Footer Links

```html
<!-- In footer section -->
<div class="footer">
    <a href="https://yourwebsite.com">Website</a> |
    <a href="https://github.com/yourusername">GitHub</a> |
    <a href="https://linkedin.com/in/yourusername">LinkedIn</a> |
    <a href="https://twitter.com/yourusername">Twitter</a>
</div>
```

## 📊 Best Practices

### Content
- ✅ Keep subject lines under 50 characters
- ✅ Use clear, actionable CTAs
- ✅ Include unsubscribe link (if sending marketing emails)
- ✅ Personalize with recipient's name
- ✅ Keep paragraphs short (2-3 sentences)

### Design
- ✅ Max width: 600px (most email clients)
- ✅ Mobile-first responsive design
- ✅ High contrast for readability
- ✅ Clear visual hierarchy
- ✅ Accessible colors (WCAG AA)

### Technical
- ✅ Inline CSS for compatibility
- ✅ Alt text for images
- ✅ Plain text fallback
- ✅ Test before deploying
- ✅ Monitor delivery rates

## 🐛 Troubleshooting

### Email appears broken
- Ensure all HTML is valid
- Check for unclosed tags
- Verify CSS is inline
- Test in email testing tool (Litmus, Email on Acid)

### Variables not replacing
- Verify n8n node configuration
- Check variable syntax: `{{ $json.field }}`
- Ensure data is passed from previous nodes

### Spam folder issues
- Avoid spam trigger words ("free", "click here", excessive caps)
- Include plain text version
- Verify SPF/DKIM records
- Use reputable email service (SendGrid, Gmail)

## 📚 Resources

- [n8n Email Node Docs](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.emailsend/)
- [HTML Email Guide](https://www.campaignmonitor.com/dev-resources/guides/coding-html-emails/)
- [Email Client Support](https://www.caniemail.com/)
- [Litmus Email Testing](https://litmus.com/)

---

**Last Updated:** February 6, 2026
**Version:** 1.0.0
