# Dev Tunnel Tool

Builds the project, serves `dist/app-universal.iife.js` locally via a
Python HTTP server, then exposes it **publicly** through ngrok or
localtunnel. Use this when something *outside your machine* needs to
reach the build — e.g. handing a live URL to someone else, or testing on
a device that can't reach `localhost`.

If you only need to test a build against a live page in your own browser,
see [`../network-override/`](../network-override/README.md) instead — it
does the swap locally without exposing anything to the internet.

## Usage

```bash
./dev-tools/dev-tunnel/dev-tunnel.sh
```

Builds, starts the local server, opens a tunnel, and prints the public
URL. Controls while running:

- `r` — rebuild and restart the server
- `v` — open the public URL in your browser
- `q` — quit (stops the server and tunnel)

Also runs a periodic health check (every 5 min) and auto-restarts the
server/tunnel if either goes down.

## Configuration (env vars)

```bash
# Tunnel provider — defaults to ngrok
TUNNEL_PROVIDER=localtunnel ./dev-tools/dev-tunnel/dev-tunnel.sh

# Stable ngrok URL (requires a claimed domain at https://dashboard.ngrok.com/domains)
NGROK_DOMAIN=my-app.ngrok-free.app ./dev-tools/dev-tunnel/dev-tunnel.sh

# Requested localtunnel subdomain (best-effort, not guaranteed available)
TUNNEL_PROVIDER=localtunnel TUNNEL_SUBDOMAIN=my-app ./dev-tools/dev-tunnel/dev-tunnel.sh
```

## Notes

- Local server runs on port `8899` — distinct from
  `network-override`'s local port (`8898` by default), so both can run at
  the same time without conflicting.
- Requires `python3`, `curl`, `npm`, and either `ngrok` (installed +
  authenticated) or `npx` (for `localtunnel`).
