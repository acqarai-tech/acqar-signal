# ACQAR SIGNAL — Deployment Guide

## Architecture

Frontend (React) → Vercel
Backend (FastAPI) → Railway
Cache (Redis) → Railway (add-on)

## Frontend → Vercel

1. Push to GitHub
2. Connect repo to Vercel (vercel.com)
3. Set root directory: `frontend`
4. Add env vars:
   - `VITE_API_URL` = your Railway backend URL (e.g., https://acqar-backend.up.railway.app)
5. Deploy

## Backend → Railway

1. Connect GitHub repo to Railway (railway.app)
2. Set root directory: `backend` (or use railway.json)
3. Add Redis add-on from Railway dashboard
4. Set env vars:
   - `REDIS_URL` = auto-set by Railway Redis add-on
   - `NEWSAPI_KEY` = your NewsAPI key (optional)
   - `ALPHA_VANTAGE_KEY` = your Alpha Vantage key (optional)
5. Deploy

## Local Development

```bash
# Terminal 1 — Backend
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:socket_app --reload --port 8000

# Terminal 2 — Frontend
cd frontend
npm install
npm run dev
```

App runs at http://localhost:5173
API runs at http://localhost:8000
API docs at http://localhost:8000/docs
