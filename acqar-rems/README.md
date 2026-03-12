# ACQAR SIGNAL — Dubai Real Estate Monitoring System

A real-time property intelligence platform that monitors market trends, sentiment signals, and economic indicators across Dubai's real estate sector.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, Vite, MapLibre GL, Tailwind CSS |
| Backend | FastAPI, Python, Socket.io |
| Real-time | Redis, WebSocket (Socket.io) |
| Database | PostgreSQL (ready for integration) |
| Deployment | Vercel (frontend), Railway (backend) |

## Data Sources

- **RSS Feeds**: Dubai property news aggregation
- **GDELT Project**: Global event analysis for real estate sentiment
- **Alpha Vantage**: Economic indicators (inflation, exchange rates)
- **Reddit/Social**: Market sentiment extraction
- **Nominatim**: Geographic data and location services

## Getting Started

### Prerequisites
- Node.js 18+
- Python 3.10+
- Redis (optional, for caching)

### Installation

1. Clone and enter the project:
```bash
git clone <your-repo-url>
cd acqar-rems
```

2. Frontend setup:
```bash
cd frontend
npm install
```

3. Backend setup:
```bash
cd ../backend
pip install -r requirements.txt
```

4. Environment configuration:
```bash
cp ../.env.example ../.env
# Edit .env with your API keys
```

### Development

**Terminal 1 — Backend:**
```bash
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
```

Access the app at `http://localhost:5173`

### Build for Production

```bash
# Frontend
cd frontend
npm run build

# Backend is deployed separately to Railway
```

## Deployment

### Frontend (Vercel)
```bash
npm install -g vercel
vercel
```

Update `vercel.json` with your backend URL before deploying.

### Backend (Railway)
Push to GitHub and connect Railway to auto-deploy from your repo.

## ACQAR Brand Colors

| Name | Hex | Usage |
|------|-----|-------|
| Copper | `#B87333` | Primary accents, highlights |
| Dark | `#1A1A2E` | Main background |
| Panel | `#16213E` | Card/panel backgrounds |
| Border | `#0F3460` | Borders and dividers |
| Text Primary | `#FAFAFA` | Main text |
| Text Secondary | `#B3B3B3` | Secondary text |
| Severity 1 | `#27AE60` | Green (positive, low risk) |
| Severity 2 | `#A8D44A` | Light green (moderate) |
| Severity 3 | `#F39C12` | Amber (warning) |
| Severity 4 | `#E67E22` | Orange (high) |
| Severity 5 | `#E74C3C` | Red (critical) |

## Project Structure

```
acqar-rems/
├── frontend/
│   ├── src/
│   │   ├── main.jsx
│   │   ├── index.css
│   │   └── App.jsx (to be created)
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
├── backend/
│   ├── main.py (to be created)
│   └── requirements.txt
├── .env.example
├── .gitignore
├── vercel.json
└── README.md
```

## License

Proprietary — ACQAR Signal
