#!/usr/bin/env bash
# dev-tunnel.sh
# Build the project, serve dist/app-universal.iife.js via Python HTTP server,
# then expose it publicly through ngrok.
# Features: initial build, health check, manual rebuild (press r), quit (press q).
#
# Custom domain (optional):
#   Free static domain  → set NGROK_DOMAIN to your claimed domain, e.g.:
#     NGROK_DOMAIN=my-app.ngrok-free.app ./dev-tunnel.sh
#   Paid subdomain      → same flag, e.g.:
#     NGROK_DOMAIN=my-app.ngrok.io ./dev-tunnel.sh
#   Or edit the variable below to hardcode it.

set -euo pipefail

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------
PORT=8899
FILE_NAME="app-universal.iife.js"
HEALTH_CHECK_INTERVAL=300   # seconds between automatic health checks
NGROK_API="http://localhost:4040/api/tunnels"
ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
DIST_DIR="$ROOT_DIR/dist"

# Set to your ngrok static/custom domain to keep a stable URL.
# Leave empty to use a random ephemeral URL (free tier default).
# Free static domain: claim one at https://dashboard.ngrok.com/domains
# Usage: NGROK_DOMAIN=abc-xyz.ngrok-free.app ./dev-tunnel.sh
NGROK_DOMAIN="${NGROK_DOMAIN:-}"

# ---------------------------------------------------------------------------
# Colors
# ---------------------------------------------------------------------------
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

# ---------------------------------------------------------------------------
# Process tracking
# ---------------------------------------------------------------------------
PYTHON_PID=""
NGROK_PID=""
PUBLIC_URL=""

# ---------------------------------------------------------------------------
# Cleanup on exit
# ---------------------------------------------------------------------------
cleanup() {
    echo -e "\n${YELLOW}Shutting down...${NC}"
    [[ -n "$PYTHON_PID" ]] && kill "$PYTHON_PID" 2>/dev/null || true
    [[ -n "$NGROK_PID" ]]  && kill "$NGROK_PID"  2>/dev/null || true
    stty echo 2>/dev/null || true
    exit 0
}
trap cleanup SIGINT SIGTERM EXIT

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------
log_info()    { echo -e "${BLUE}[INFO]${NC}  $*"; }
log_ok()      { echo -e "${GREEN}[OK]${NC}    $*"; }
log_warn()    { echo -e "${YELLOW}[WARN]${NC}  $*"; }
log_error()   { echo -e "${RED}[ERROR]${NC} $*"; }
log_ts()      { echo -e "${CYAN}[$(date '+%H:%M:%S')]${NC} $*"; }

check_deps() {
    local missing=()
    command -v python3 &>/dev/null || missing+=("python3")
    command -v ngrok   &>/dev/null || missing+=("ngrok")
    command -v curl    &>/dev/null || missing+=("curl")
    command -v npm     &>/dev/null || missing+=("npm")
    if [[ ${#missing[@]} -gt 0 ]]; then
        log_error "Missing dependencies: ${missing[*]}"
        exit 1
    fi
}

# ---------------------------------------------------------------------------
# Build
# ---------------------------------------------------------------------------
do_build() {
    log_info "Running npm run build..."
    cd "$ROOT_DIR"
    if npm run build; then
        log_ok "Build complete."
        return 0
    else
        log_error "Build FAILED."
        return 1
    fi
}

# ---------------------------------------------------------------------------
# Python HTTP server
# ---------------------------------------------------------------------------
start_python_server() {
    if [[ -n "$PYTHON_PID" ]] && kill -0 "$PYTHON_PID" 2>/dev/null; then
        kill "$PYTHON_PID" 2>/dev/null || true
        sleep 1
    fi

    if [[ ! -f "$DIST_DIR/$FILE_NAME" ]]; then
        log_error "$DIST_DIR/$FILE_NAME not found. Build may have failed."
        return 1
    fi

    lsof -ti tcp:"$PORT" | xargs kill -9 2>/dev/null || true
    sleep 0.5

    cd "$DIST_DIR"
    python3 -m http.server "$PORT" --bind 127.0.0.1 &>/dev/null &
    PYTHON_PID=$!

    sleep 1
    if kill -0 "$PYTHON_PID" 2>/dev/null; then
        log_ok "Python HTTP server running on port $PORT (PID: $PYTHON_PID)"
        return 0
    else
        log_error "Failed to start Python HTTP server."
        return 1
    fi
}

# ---------------------------------------------------------------------------
# ngrok
# ---------------------------------------------------------------------------
start_ngrok() {
    if [[ -n "$NGROK_PID" ]] && kill -0 "$NGROK_PID" 2>/dev/null; then
        kill "$NGROK_PID" 2>/dev/null || true
        sleep 1
    fi
    pkill -f "ngrok http $PORT" 2>/dev/null || true
    sleep 1

    if [[ -n "$NGROK_DOMAIN" ]]; then
        log_info "Starting ngrok with domain: ${CYAN}${NGROK_DOMAIN}${NC}"
        ngrok http "$PORT" --domain="$NGROK_DOMAIN" --log=false &>/dev/null &
    else
        log_info "Starting ngrok with ephemeral URL..."
        ngrok http "$PORT" --log=false &>/dev/null &
    fi
    NGROK_PID=$!
    sleep 2

    if kill -0 "$NGROK_PID" 2>/dev/null; then
        log_ok "ngrok started (PID: $NGROK_PID)"
        return 0
    else
        log_error "Failed to start ngrok. Is it installed and authenticated?"
        return 1
    fi
}

fetch_ngrok_url() {
    # If a custom domain is set, the URL is deterministic — no need to poll the API.
    if [[ -n "$NGROK_DOMAIN" ]]; then
        echo "https://${NGROK_DOMAIN}"
        return 0
    fi

    local retries=20
    local url=""
    for ((i=1; i<=retries; i++)); do
        url=$(curl -s "$NGROK_API" 2>/dev/null \
            | python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
    tunnels = data.get('tunnels', [])
    https = [t['public_url'] for t in tunnels if t['public_url'].startswith('https')]
    print(https[0] if https else (tunnels[0]['public_url'] if tunnels else ''))
except Exception:
    print('')
" 2>/dev/null)
        if [[ -n "$url" ]]; then
            echo "$url"
            return 0
        fi
        sleep 1
    done
    return 1
}

# ---------------------------------------------------------------------------
# Health check
# ---------------------------------------------------------------------------
health_check() {
    local target_url="$1"

    if ! kill -0 "$PYTHON_PID" 2>/dev/null; then
        log_warn "Python server is down. Restarting..."
        start_python_server || return 1
    fi

    if ! kill -0 "$NGROK_PID" 2>/dev/null; then
        log_warn "ngrok is down. Restarting..."
        start_ngrok || return 1
        local new_base
        new_base=$(fetch_ngrok_url) || { log_error "Could not get ngrok URL after restart."; return 1; }
        PUBLIC_URL="${new_base}/${FILE_NAME}"
        print_url
    fi

    local http_code
    http_code=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "$target_url" 2>/dev/null || echo "000")
    if [[ "$http_code" == "200" ]]; then
        log_ts "${GREEN}Health check OK${NC} — HTTP $http_code"
        return 0
    else
        log_ts "${RED}Health check FAILED${NC} — HTTP $http_code for $target_url"
        return 1
    fi
}

# ---------------------------------------------------------------------------
# Print the public URL banner
# ---------------------------------------------------------------------------
print_url() {
    echo ""
    echo -e "${GREEN}${BOLD}════════════════════════════════════════════════${NC}"
    echo -e "${GREEN}${BOLD}  Public URL:${NC}"
    echo -e "${CYAN}${BOLD}  $PUBLIC_URL${NC}"
    echo -e "${GREEN}${BOLD}════════════════════════════════════════════════${NC}"
    echo ""
}

# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------
echo -e "${BOLD}${BLUE}"
echo "  ╔═════════════════════════════════╗"
echo "  ║     e-iam-site  Dev Tunnel      ║"
echo "  ╚═════════════════════════════════╝"
echo -e "${NC}"

check_deps

do_build          || exit 1
start_python_server || exit 1
start_ngrok       || exit 1

log_info "Waiting for ngrok tunnel URL..."
BASE_URL=$(fetch_ngrok_url) || { log_error "Could not retrieve ngrok URL."; cleanup; }
PUBLIC_URL="${BASE_URL}/${FILE_NAME}"

print_url
echo -e "Controls: ${BOLD}[r]${NC} rebuild  ${BOLD}[v]${NC} visit  ${BOLD}[q]${NC} quit\n"

# ---------------------------------------------------------------------------
# Interactive loop (health check + keyboard input)
# ---------------------------------------------------------------------------
stty -echo 2>/dev/null || true
last_check=$(date +%s)

while true; do
    key=""
    if IFS= read -r -s -n1 -t 1 key 2>/dev/null; then
        case "$key" in
            r|R)
                echo ""
                log_info "Manual rebuild requested..."
                if do_build; then
                    start_python_server && log_ok "Server restarted with new build."
                    print_url
                fi
                ;;
            v|V)
                open "$PUBLIC_URL" 2>/dev/null || xdg-open "$PUBLIC_URL" 2>/dev/null || log_warn "Cannot open browser automatically."
                ;;
            q|Q)
                cleanup
                ;;
        esac
    fi

    now=$(date +%s)
    if (( now - last_check >= HEALTH_CHECK_INTERVAL )); then
        last_check=$now
        health_check "$PUBLIC_URL" || true
    fi
done
