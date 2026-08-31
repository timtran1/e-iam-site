#!/usr/bin/env bash
# test-with-local-build.sh
# Build the project, serve dist/app-universal.iife.js locally via a Python
# HTTP server, then open a target website with that build injected in place
# of the real production script (via override-and-open.js / Playwright
# network interception). No public tunnel needed — the swap happens inside
# the local browser session only.
# Features: initial build, manual rebuild (press r), quit (press q).
#
# Match pattern (which production request to intercept, optional):
#     MATCH_PATTERN='**/some/other/bundle.js*' ./dev-tools/network-override/test-with-local-build.sh
#
# Local server port (optional, defaults to 8898 — different from dev-tunnel.sh's 8899):
#     LOCAL_PORT=9000 ./dev-tools/network-override/test-with-local-build.sh

set -euo pipefail

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------
LOCAL_PORT="${LOCAL_PORT:-8898}"
FILE_NAME="app-universal.iife.js"
MATCH_PATTERN="${MATCH_PATTERN:-**/r/design2026/design2026_de.js*}"
DEFAULT_TARGET_URL="https://docs.eiam.admin.ch/index.php"
HEADLESS="${HEADLESS:-false}"
ROOT_DIR="$(cd "$(dirname "$0")/../.." && pwd)"
DIST_DIR="$ROOT_DIR/dist"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

# ---------------------------------------------------------------------------
# Colors
# ---------------------------------------------------------------------------
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
BOLD='\033[1m'
NC='\033[0m'

log_info()  { echo -e "${BLUE}[INFO]${NC}  $*"; }
log_ok()    { echo -e "${GREEN}[OK]${NC}    $*"; }
log_warn()  { echo -e "${YELLOW}[WARN]${NC}  $*"; }
log_error() { echo -e "${RED}[ERROR]${NC} $*"; }

# ---------------------------------------------------------------------------
# Process tracking
# ---------------------------------------------------------------------------
PYTHON_PID=""
NODE_PID=""

# ---------------------------------------------------------------------------
# Cleanup on exit
# ---------------------------------------------------------------------------
cleanup() {
    trap - SIGINT SIGTERM EXIT
    echo -e "\n${YELLOW}Shutting down...${NC}"
    [[ -n "$NODE_PID" ]] && kill "$NODE_PID" 2>/dev/null || true
    [[ -n "$PYTHON_PID" ]] && kill "$PYTHON_PID" 2>/dev/null || true
    stty echo 2>/dev/null || true
    exit 0
}
trap cleanup SIGINT SIGTERM EXIT

# ---------------------------------------------------------------------------
# Dependency check
# ---------------------------------------------------------------------------
command -v python3 &>/dev/null || { log_error "python3 is required."; exit 1; }
command -v node &>/dev/null || { log_error "node is required."; exit 1; }

# ---------------------------------------------------------------------------
# Prompt for target URL
# ---------------------------------------------------------------------------
read -r -p "Target URL to open [Default: ${DEFAULT_TARGET_URL}]: " TARGET_URL
TARGET_URL="${TARGET_URL:-$DEFAULT_TARGET_URL}"

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

do_build || exit 1

if [[ ! -f "$DIST_DIR/$FILE_NAME" ]]; then
    log_error "$DIST_DIR/$FILE_NAME not found. Build may have failed."
    exit 1
fi

# ---------------------------------------------------------------------------
# Serve dist/ locally
# ---------------------------------------------------------------------------
lsof -ti tcp:"$LOCAL_PORT" | xargs kill -9 2>/dev/null || true
sleep 0.5

cd "$DIST_DIR"
python3 -m http.server "$LOCAL_PORT" --bind 127.0.0.1 &>/dev/null &
PYTHON_PID=$!
sleep 1

if ! kill -0 "$PYTHON_PID" 2>/dev/null; then
    log_error "Failed to start local HTTP server on port $LOCAL_PORT."
    exit 1
fi
log_ok "Serving $DIST_DIR on http://127.0.0.1:$LOCAL_PORT (PID: $PYTHON_PID)"

REPLACE_URL="http://127.0.0.1:${LOCAL_PORT}/${FILE_NAME}"

# ---------------------------------------------------------------------------
# Launch browser with override
# ---------------------------------------------------------------------------
log_info "Opening ${TARGET_URL} with ${FILE_NAME} injected in place of the production script..."
HEADLESS_FLAG=""
[[ "$HEADLESS" == "true" ]] && HEADLESS_FLAG="--headless"

# Intentionally unquoted: HEADLESS_FLAG is always either empty or the fixed
# literal "--headless" (no spaces/globbing), and bash 3.2 (macOS default)
# raises "unbound variable" under `set -u` when expanding an empty array.
node "$SCRIPT_DIR/override-and-open.js" \
    --url "$TARGET_URL" \
    --match "$MATCH_PATTERN" \
    --replace "$REPLACE_URL" \
    $HEADLESS_FLAG &
NODE_PID=$!
sleep 1

if ! kill -0 "$NODE_PID" 2>/dev/null; then
    log_error "Browser process exited unexpectedly."
    exit 1
fi

echo -e "Controls: ${BOLD}[r]${NC} rebuild + reload  ${BOLD}[q]${NC} quit\n"

# ---------------------------------------------------------------------------
# Interactive loop (rebuild + quit)
# ---------------------------------------------------------------------------
stty -echo 2>/dev/null || true

while true; do
    key=""
    if IFS= read -r -s -n1 -t 1 key 2>/dev/null; then
        case "$key" in
            r|R)
                echo ""
                log_info "Manual rebuild requested..."
                if do_build; then
                    log_ok "Reloading page..."
                    kill -USR1 "$NODE_PID" 2>/dev/null || true
                fi
                ;;
            q|Q)
                cleanup
                ;;
        esac
    fi
done
