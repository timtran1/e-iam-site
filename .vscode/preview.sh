#!/bin/bash
lsof -ti:8000 | xargs kill -9 2>/dev/null
lsof -ti:4040 | xargs kill -9 2>/dev/null
npm run build
(cd dist && python3 -m http.server 8000) &
ngrok http 8000 &
sleep 3
NGROK_URL=$(curl -s http://localhost:4040/api/tunnels | python3 -c "import sys,json; print(json.load(sys.stdin)['tunnels'][0]['public_url'])")
open "${NGROK_URL}/app-universal.iife.js"
open "https://docs-r.eiam.admin.ch/?lowstage=on&l=en&designUrl=${NGROK_URL}/app-universal.iife.js"
echo "Opened $NGROK_URL/app-universal.iife.js and docs-r"
wait
