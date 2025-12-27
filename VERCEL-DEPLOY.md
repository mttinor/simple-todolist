# Deploying to Vercel

## ⚠️ Important: Backend Deployment

**Vercel is for the frontend only!** Your NestJS backend needs to be deployed separately to:
- Railway (recommended)
- Render
- Heroku
- DigitalOcean
- Or any Node.js hosting service

## ✅ Frontend Deployment to Vercel

### Step 1: Configure Vercel

The `vercel.json` is already configured to use the `front/` directory.

### Step 2: Update Environment Variables

1. Go to your Vercel project settings
2. Navigate to **Environment Variables**
3. Add:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app
   ```
   (Replace with your actual backend URL)

### Step 3: Deploy

**Option A: Via Vercel Dashboard**
1. Go to https://vercel.com
2. Import your Git repository
3. Vercel will auto-detect Next.js
4. Set **Root Directory** to `front`
5. Add environment variable `NEXT_PUBLIC_API_URL`
6. Deploy!

**Option B: Via CLI**
```bash
cd front
npm i -g vercel
vercel
```

### Step 4: Update API URL in Code (if needed)

If you want to use different URLs for dev/prod, update `front/lib/api.ts`:

```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 
  (process.env.NODE_ENV === 'production' 
    ? 'https://your-backend-url.railway.app'
    : 'http://localhost:3001');
```

## 🚀 Backend Deployment (Railway - Recommended)

### Step 1: Create Railway Account
1. Go to https://railway.app
2. Sign up with GitHub

### Step 2: Deploy Backend
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose your repository
4. Set **Root Directory** to `backend`
5. Railway will auto-detect NestJS

### Step 3: Environment Variables
Add in Railway dashboard:
```
JWT_SECRET=your-secret-key-here
PORT=3001
```

### Step 4: Get Backend URL
Railway will provide a URL like:
```
https://your-app-name.up.railway.app
```

### Step 5: Update Frontend
Update `NEXT_PUBLIC_API_URL` in Vercel to your Railway backend URL.

## 🔧 Alternative: Deploy Backend to Render

1. Go to https://render.com
2. Create new **Web Service**
3. Connect GitHub repo
4. Set:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm run start:prod`
5. Add environment variables
6. Deploy!

## 📝 Current Configuration

- ✅ `vercel.json` - Points to `front/` directory
- ✅ Frontend ready for Vercel
- ⚠️ Backend needs separate deployment

## 🐛 Troubleshooting 404 Error

If you're getting 404:
1. **Check Root Directory:** In Vercel settings, make sure Root Directory is set to `front`
2. **Check Build Settings:** Verify build command is `cd front && npm run build`
3. **Check Environment Variables:** Make sure `NEXT_PUBLIC_API_URL` is set
4. **Redeploy:** Try redeploying after fixing settings

## 🔗 Quick Links

- Vercel Dashboard: https://vercel.com/dashboard
- Railway: https://railway.app
- Render: https://render.com

