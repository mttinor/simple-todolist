# How to Run Backend and Frontend

## 🚀 Quick Start (Run Both Together)

From the root directory:
```bash
npm run dev
```

This will start:
- ✅ Backend on http://localhost:3001
- ✅ Frontend on http://localhost:3000

## 📋 Option 1: Run Both Together (Recommended)

### Step 1: Install root dependencies (if needed)
```bash
npm install
```

### Step 2: Run both services
```bash
npm run dev
```

This uses `npm-run-all` to run both backend and frontend in parallel.

## 📋 Option 2: Run Separately (Two Terminals)

### Terminal 1 - Backend:
```bash
cd backend
npm run start:dev
```

You should see:
```
Application is running on: http://localhost:3001
```

### Terminal 2 - Frontend:
```bash
cd front
npm run dev
```

You should see:
```
Ready on http://localhost:3000
```

## 🌐 Access the Application

Once both are running:
- **Frontend:** Open http://localhost:3000 in your browser
- **Backend API:** Available at http://localhost:3001

## ✅ Verify Everything is Working

1. **Check Backend:**
   - Open http://localhost:3001/auth/me (should return error without auth, but confirms backend is running)

2. **Check Frontend:**
   - Open http://localhost:3000
   - You should see the sign-in page

3. **Test Connection:**
   - Sign in (or anonymously)
   - Create a todo
   - If it works, backend and frontend are connected! ✅

## 🛑 Stop the Services

Press `Ctrl+C` in the terminal(s) to stop the services.

## 📊 View Database

After running the backend, the database will be created at:
```
backend/todo.db
```

To view it:
```bash
cd backend
sqlite3 todo.db
.tables
SELECT * FROM users;
SELECT * FROM todos;
.quit
```

## 🔧 Troubleshooting

**Backend won't start?**
- Make sure port 3001 is available
- Check if dependencies are installed: `cd backend && npm install`

**Frontend won't start?**
- Make sure port 3000 is available
- Check if dependencies are installed: `cd front && npm install`
- Verify `.env.local` exists in `front/` with: `NEXT_PUBLIC_API_URL=http://localhost:3001`

**Connection issues?**
- Make sure backend is running first
- Check browser console for errors
- Verify CORS is enabled in backend (it is by default)

