#!/bin/bash
# ============================================================
#  ACQAR SIGNAL — Local Development Startup
#  Runs frontend (port 5173) + backend (port 8000)
# ============================================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FRONTEND="$SCRIPT_DIR/frontend"
BACKEND="$SCRIPT_DIR/backend"

# Colors
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'
CYAN='\033[0;36m'; BOLD='\033[1m'; NC='\033[0m'

echo ""
echo -e "${BOLD}${CYAN}◈ ACQAR SIGNAL — Local Dev Server${NC}"
echo -e "${CYAN}────────────────────────────────────${NC}"

# ── Check Node & Python ──────────────────────────────────────
if ! command -v node &>/dev/null; then
  echo -e "${RED}✗ Node.js not found. Install from https://nodejs.org${NC}"
  exit 1
fi
if ! command -v python3 &>/dev/null; then
  echo -e "${RED}✗ Python3 not found. Install from https://python.org${NC}"
  exit 1
fi
echo -e "${GREEN}✓ Node $(node --version)  Python $(python3 --version | cut -d' ' -f2)${NC}"

# ── Backend Setup ────────────────────────────────────────────
echo ""
echo -e "${YELLOW}[1/4] Setting up Python backend...${NC}"
cd "$BACKEND"

# Create venv if it doesn't exist
if [ ! -d "venv" ]; then
  echo "    Creating virtual environment..."
  python3 -m venv venv
fi
source venv/bin/activate

echo "    Installing Python packages (first run may take 1-2 min)..."
pip install -q -r requirements.txt

# ── Start Backend ─────────────────────────────────────────────
echo ""
echo -e "${YELLOW}[2/4] Starting FastAPI backend on port 8000...${NC}"
uvicorn main:socket_app --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!
echo -e "${GREEN}    ✓ Backend PID: $BACKEND_PID${NC}"
sleep 2

# ── Frontend Setup ───────────────────────────────────────────
echo ""
echo -e "${YELLOW}[3/4] Installing frontend packages (if needed)...${NC}"
cd "$FRONTEND"

if [ ! -d "node_modules" ]; then
  npm install --silent
fi

# ── Start Frontend ────────────────────────────────────────────
echo ""
echo -e "${YELLOW}[4/4] Starting React dev server on port 5173...${NC}"
npm run dev &
FRONTEND_PID=$!
sleep 3

# ── Done ──────────────────────────────────────────────────────
echo ""
echo -e "${BOLD}${GREEN}════════════════════════════════════${NC}"
echo -e "${BOLD}${GREEN}  ✅ ACQAR SIGNAL is running!${NC}"
echo -e "${BOLD}${GREEN}════════════════════════════════════${NC}"
echo ""
echo -e "  ${CYAN}Frontend:${NC}  http://localhost:5173"
echo -e "  ${CYAN}Backend:${NC}   http://localhost:8000"
echo -e "  ${CYAN}API Docs:${NC}  http://localhost:8000/docs"
echo ""
echo -e "  Press ${BOLD}Ctrl+C${NC} to stop all servers"
echo ""

# Cleanup on exit
cleanup() {
  echo ""
  echo -e "${YELLOW}Stopping servers...${NC}"
  kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
  deactivate 2>/dev/null
  echo -e "${GREEN}Done.${NC}"
}
trap cleanup EXIT INT TERM

# Keep running
wait
