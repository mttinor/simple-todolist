# Quick Fix for Vercel 404 Error

## 🔧 The Problem

Vercel is looking in the root directory, but your Next.js app is in the `front/` folder.

## ✅ Solution 1: Set Root Directory in Vercel Dashboard (Easiest)

1. Go to your Vercel project: https://vercel.com/dashboard
2. Click on your project
3. Go to **Settings** → **General**
4. Scroll to **Root Directory**
5. Set it to: `front`
6. Click **Save**
7. **Redeploy** your project

## ✅ Solution 2: Deploy from Front Directory

Instead of deploying from root, deploy the `front/` folder directly:

```bash
cd front
vercel
```

## ✅ Solution 3: Use Vercel CLI with Root Directory

```bash
vercel --cwd front
```

## 📝 Environment Variables

Don't forget to add in Vercel Dashboard → Settings → Environment Variables:

```
NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app
```

(Replace with your actual backend URL after deploying backend)

## 🚀 After Fixing

1. Set Root Directory to `front` in Vercel dashboard
2. Add environment variable `NEXT_PUBLIC_API_URL`
3. Redeploy
4. Your app should work at: https://simple-todolist-nu.vercel.app/

## ⚠️ Important: Backend Deployment

Your NestJS backend needs to be deployed separately (Railway, Render, etc.) because Vercel is for frontend/serverless functions only.

See `VERCEL-DEPLOY.md` for full deployment guide.

