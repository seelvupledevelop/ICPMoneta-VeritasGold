#!/usr/bin/env bash
# ==============================================================================
# 🏛️ VERITAS INSTITUTIONAL LEDGER — ONE-TOUCH VPS SETUP & RUNNER SCRIPT
# ==============================================================================
# Usage on any fresh VPS:
#   chmod +x setup_and_run_vps.sh
#   ./setup_and_run_vps.sh
#
# This script installs/verifies dependencies, builds the bundle if needed,
# and starts the institutional platform on port 8080 (or custom PORT).
# ==============================================================================

set -eo pipefail

PORT="${PORT:-8080}"
HOST="${HOST:-0.0.0.0}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

BOLD='\033[1m'
RED='\033[0;31m'
GREEN='\033[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
RESET='\033[0m'

echo -e "${BOLD}${CYAN}"
echo "================================================================================"
echo "    🏛️  VERITAS INSTITUTIONAL PLATFORM — ONE-TOUCH VPS INSTALLER & RUNNER       "
echo "================================================================================"
echo -e "${RESET}"

# 1. System packages check
echo -e "${CYAN}🔍 [1/3] Checking System Environment...${RESET}"

if ! command -v node >/dev/null 2>&1 || ! command -v npm >/dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  Node.js / npm not detected. Attempting installation via package manager...${RESET}"
    if command -v apt-get >/dev/null 2>&1; then
        sudo apt-get update -y && sudo apt-get install -y nodejs npm curl python3
    elif command -v yum >/dev/null 2>&1; then
        sudo yum install -y nodejs npm curl python3
    else
        echo -e "${RED}❌ Please install Node.js (v18+) and npm manually on this host.${RESET}"
        exit 1
    fi
fi

NODE_VER=$(node -v 2>/dev/null || echo "Unknown")
NPM_VER=$(npm -v 2>/dev/null || echo "Unknown")
echo -e "   ✓ Node.js: ${GREEN}${NODE_VER}${RESET} | npm: ${GREEN}${NPM_VER}${RESET}"

# 2. Build / Verify Frontend Production Bundle
echo -e "\n${CYAN}📦 [2/3] Ensuring Frontend Dependencies & Production Bundle...${RESET}"
cd frontend
if [ ! -d "node_modules" ]; then
    echo "   Installing frontend dependencies (npm install)..."
    npm install
fi

if [ ! -d "dist" ] || [ ! -f "dist/index.html" ]; then
    echo "   Compiling production bundle (npm run build)..."
    npm run build
else
    echo -e "   ✓ Production bundle verified in ${GREEN}frontend/dist${RESET}"
fi
cd ..

# 3. Host IP Detection
LAN_IP=$(hostname -I 2>/dev/null | awk '{print $1}' || echo "127.0.0.1")

echo -e "\n${CYAN}🚀 [3/3] Launching Veritas Institutional Platform on ${HOST}:${PORT}...${RESET}"

# Graceful exit handler
cleanup() {
    echo -e "\n${YELLOW}🛑 Shutting down server...${RESET}"
    if [ -n "$SERVER_PID" ]; then
        kill "$SERVER_PID" 2>/dev/null || true
    fi
    exit 0
}
trap cleanup SIGINT SIGTERM

python3 -m http.server "$PORT" --bind "$HOST" --directory frontend/dist >/dev/null 2>&1 &
SERVER_PID=$!

sleep 1

echo -e "\n${BOLD}${GREEN}================================================================================${RESET}"
echo -e "${BOLD}${GREEN}   ✨ VERITAS INSTITUTIONAL LEDGER IS LIVE & ACCESSIBLE!                        ${RESET}"
echo -e "${BOLD}${GREEN}================================================================================${RESET}"
echo -e ""
echo -e "   🌐 ${BOLD}Workstation / Desktop View:${RESET}     ${CYAN}http://${LAN_IP}:${PORT}${RESET}"
echo -e "   🚪 ${BOLD}Institutional Login Gateway:${RESET}     ${CYAN}http://${LAN_IP}:${PORT}/?login=true${RESET}"
echo -e "   📱 ${BOLD}Direct Mobile iPhone View:${RESET}       ${CYAN}http://${LAN_IP}:${PORT}/?mode=mobile${RESET}"
echo -e "   📟 ${BOLD}Direct Tablet iPad View:${RESET}         ${CYAN}http://${LAN_IP}:${PORT}/?mode=tablet${RESET}"
echo -e ""
echo -e "   🔒 ${BOLD}External Showcase Access:${RESET}"
echo -e "      Point testers to: ${YELLOW}http://<YOUR_VPS_PUBLIC_IP>:${PORT}/?login=true${RESET}"
echo -e ""
echo -e "   ${BOLD}Press [Ctrl+C] to stop the server at any time.${RESET}"
echo -e "================================================================================\n"

wait "$SERVER_PID"
