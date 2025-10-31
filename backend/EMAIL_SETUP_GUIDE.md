# 📧 Email Setup Guide for Password Reset

## 🎯 Current Status
Your forgot password feature is **working** but emails aren't being sent yet. This guide will help you set it up!

---

## 📝 Quick Setup Steps

### **Option 1: Gmail (Recommended for Testing)**

#### Step 1: Enable 2-Factor Authentication on Gmail
1. Go to your Google Account: https://myaccount.google.com/
2. Click **Security** in the left menu
3. Enable **2-Step Verification** (if not already enabled)

#### Step 2: Create an App Password
1. Go to: https://myaccount.google.com/apppasswords
2. Select app: **Mail**
3. Select device: **Other (Custom name)** → Type "Spendly"
4. Click **Generate**
5. Copy the 16-character password (looks like: `xxxx xxxx xxxx xxxx`)

#### Step 3: Add to Your `.env` File
Open `backend/.env` and add these lines:

```env
# Email Configuration
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-16-char-app-password
NODE_ENV=development
```

**Example:**
```env
EMAIL_SERVICE=gmail
EMAIL_USER=vaaheesan@gmail.com
EMAIL_PASSWORD=abcd efgh ijkl mnop
NODE_ENV=development
```

#### Step 4: Restart Your Backend
```bash
cd backend
npm start
```

#### Step 5: Test It!
1. Go to your app → Click "Forgot Password"
2. Enter your email
3. Check your inbox! 📬

---

### **Option 2: Other Email Services**

#### **SendGrid (Free 100 emails/day)**
```env
EMAIL_SERVICE=sendgrid
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=your-sendgrid-api-key
```

#### **Mailgun (Free 1000 emails/month)**
```env
EMAIL_SERVICE=mailgun
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_USER=your-mailgun-username
SMTP_PASSWORD=your-mailgun-password
```

#### **Outlook/Hotmail**
```env
EMAIL_SERVICE=outlook
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_USER=your-email@outlook.com
SMTP_PASSWORD=your-password
```

---

## 🧪 Testing Without Email (Current Mode)

If you don't want to set up email yet, you can still test password reset:

1. Click "Forgot Password"
2. Enter your email
3. Look at the backend terminal - it will show:
   ```
   🔗 Password reset link: http://localhost:5173/reset-password/abc123...
   ```
4. Copy that link and paste it in your browser

---

## 🔒 Security Notes

- **NEVER** commit your `.env` file to GitHub (it's already in `.gitignore`)
- Use App Passwords for Gmail (not your actual Gmail password)
- In production, remove `resetLink` from API responses

---

## 🐛 Troubleshooting

### "Error sending email: Invalid login"
- Make sure you're using an **App Password**, not your regular Gmail password
- Double-check the email address is correct

### "Error: connect ECONNREFUSED"
- Check your internet connection
- Verify SMTP settings are correct

### Still seeing the reset link instead of email?
- Make sure you've added the email settings to `.env`
- Restart your backend server
- Check the terminal for errors

---

## 📱 Email Preview

When emails are working, users will receive a beautiful purple-themed email like this:

```
┌─────────────────────────────────────┐
│   🔐 Password Reset Request         │
│   (Purple gradient header)          │
├─────────────────────────────────────┤
│                                     │
│  Hi Vaaheesan,                     │
│                                     │
│  We received a request to reset    │
│  your Spendly password.            │
│                                     │
│     ┌───────────────────┐         │
│     │  Reset Password   │         │
│     └───────────────────┘         │
│                                     │
│  This link expires in 1 hour.      │
│                                     │
└─────────────────────────────────────┘
```

---

## ✅ Next Steps

1. **Now**: Choose Option 1 (Gmail) and follow the steps above
2. **Later**: When deploying, switch to professional email service (SendGrid/Mailgun)
3. **Production**: Set `NODE_ENV=production` to hide reset links in API responses

Need help? Let me know! 🚀
