# Vercel Deployment Guide

## Important Notes

This project uses **Convex** as its backend database. You **do NOT need SQLite3** for deployment.

### How It Works:
- **Frontend**: Deploys to Vercel (React/Vite app)
- **Backend**: Runs on Convex's infrastructure (already set up)
- **Database**: Handled by Convex (no SQLite needed)

## Deployment Steps

1. **Push your code to GitHub/GitLab/Bitbucket**

2. **Import project to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your repository

3. **Set Environment Variables**:
   - In Vercel project settings, add:
     - `VITE_CONVEX_URL`: Your Convex deployment URL
     - You can find this in your Convex dashboard

4. **Deploy**:
   - Vercel will automatically detect the Vite framework
   - The build will run automatically

## About SQLite3

SQLite3 has been installed in the project, but:
- **It won't work on Vercel** (serverless functions are stateless)
- **It's not needed** (Convex handles the database)
- If you need SQLite for local development or testing, you can use it, but it won't be used in production

## Convex Backend

Your Convex backend is already deployed and running. Make sure:
- Your Convex deployment is active
- The `VITE_CONVEX_URL` environment variable points to the correct Convex deployment
- You can find your deployment URL in the [Convex Dashboard](https://dashboard.convex.dev)

