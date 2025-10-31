# 🚀 Spendly Deployment Guide

## ✅ **What's Already Done:**
- ✓ MongoDB Atlas connected and working
- ✓ User registration working
- ✓ Frontend built for production (in `frontend/dist` folder)
- ✓ Environment variables configured

---

## 🌐 **Deployment Options (Choose One)**

### **Option 1: Vercel (Recommended - EASIEST) ⭐**

#### **Backend Deployment:**
1. Create account at https://vercel.com
2. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```
3. Deploy backend:
   ```bash
   cd backend
   vercel
   ```
4. Add environment variables in Vercel dashboard:
   - `MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: Your JWT secret
   - `CLIENT_URL`: Your frontend URL (will get after deploying frontend)

#### **Frontend Deployment:**
1. Deploy frontend:
   ```bash
   cd frontend
   vercel
   ```
2. Update backend `CLIENT_URL` with your frontend URL

**Total Time:** 15-20 minutes  
**Cost:** FREE

---

### **Option 2: Railway.app (Great for Backend) 🚂**

#### **Backend:**
1. Go to https://railway.app
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your Spendly repository
5. Add environment variables:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `PORT` = 3001
   - `NODE_ENV` = production

#### **Frontend:**
Use Vercel or Netlify (see below)

**Total Time:** 20 minutes  
**Cost:** FREE (500 hours/month)

---

### **Option 3: Netlify (Great for Frontend) 🎨**

#### **Frontend Only:**
1. Go to https://netlify.com
2. Drag and drop your `frontend/dist` folder
3. Add environment variable:
   - `VITE_API_URL` = Your backend URL

#### **Backend:**
Use Railway.app or Render.com

**Total Time:** 10 minutes for frontend  
**Cost:** FREE

---

## 📝 **Step-by-Step: Quick Deployment (Vercel)**

### **Step 1: Install Vercel CLI**
```bash
npm install -g vercel
```

### **Step 2: Deploy Backend**
```bash
cd "c:\Users\91866\Desktop\5th Sem Projects\Spendly\backend"
vercel
```

Follow prompts:
- Set up and deploy? **Y**
- Which scope? **Your account**
- Link to existing project? **N**
- What's your project's name? **spendly-backend**
- In which directory is your code? **./**
- Want to modify settings? **N**

### **Step 3: Add Environment Variables**
After deployment, go to Vercel dashboard:
1. Click on your project
2. Go to "Settings" → "Environment Variables"
3. Add:
   ```
   MONGODB_URI = mongodb+srv://vaahee21_db_user:zDhv25LWanaAIrBt@spendly-production.3udxmch.mongodb.net/spendly?retryWrites=true&w=majority
   JWT_SECRET = spendly_super_secret_jwt_key_2025_production_v1_secure_random_string
   JWT_EXPIRES_IN = 30d
   NODE_ENV = production
   ```
4. Redeploy: `vercel --prod`

### **Step 4: Deploy Frontend**
```bash
cd "c:\Users\91866\Desktop\5th Sem Projects\Spendly\frontend"
```

Create `.env.production`:
```env
VITE_API_URL=https://your-backend-url.vercel.app/api
```

Deploy:
```bash
vercel
```

### **Step 5: Update CORS**
Update backend `.env` on Vercel:
```
CLIENT_URL=https://your-frontend-url.vercel.app
```

Redeploy backend: `vercel --prod`

---

## 🔒 **Security Checklist Before Going Live**

- [ ] Strong JWT secret (at least 32 characters)
- [ ] HTTPS enabled (automatic with Vercel/Netlify)
- [ ] CORS configured for your domain only
- [ ] Rate limiting enabled
- [ ] Environment variables set correctly
- [ ] MongoDB IP whitelist: 0.0.0.0/0 (allow all for serverless)

---

## 🧪 **Testing Your Deployed App**

1. Visit your frontend URL
2. Register a new account
3. Add expenses
4. Check MongoDB Atlas to verify data is being saved
5. Test on mobile browser
6. Share link with friends!

---

## 📊 **Monitoring & Maintenance**

### **Monitor Your App:**
- **Vercel Dashboard:** Check deployment status, logs
- **MongoDB Atlas:** Monitor database usage, queries
- **Browser Console:** Check for any errors

### **Free Tier Limits:**
- **Vercel:** Unlimited deployments, 100GB bandwidth/month
- **MongoDB Atlas:** 512MB storage, shared cluster
- **Railway:** 500 hours/month (~20 days)

---

## 🎯 **What to Do Next?**

Choose your preferred option:

1. **Quick & Easy:** Vercel for both (20 mins)
2. **Best Performance:** Railway (backend) + Vercel (frontend) (30 mins)
3. **Traditional:** DigitalOcean/AWS (advanced, 1-2 hours)

**Recommendation:** Start with **Vercel** for both. It's free, fast, and easy!

---

## 💡 **Need Help?**

Common issues and solutions:

**Issue:** CORS error after deployment  
**Solution:** Update `CLIENT_URL` in backend env variables

**Issue:** API not found (404)  
**Solution:** Check `VITE_API_URL` in frontend

**Issue:** MongoDB connection failed  
**Solution:** Add `0.0.0.0/0` to MongoDB IP whitelist

---

**Ready to deploy? Let me know which option you want to use!** 🚀
