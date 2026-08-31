# Network Override Tool

Intercepts a network request on a live page and serves the response body
from a different source instead — e.g. testing your local build against
production (`docs.eiam.admin.ch`), without needing deploy access. Runs
entirely in a local Playwright browser session; the real server and other
users are never touched, and nothing needs to be exposed to the internet.

## Quick start (recommended)

Builds the project, serves `dist/app-universal.iife.js` on a local port,
and opens the target page with that build injected in place of the
production script:

```bash
./dev-tools/network-override/test-with-local-build.sh
```

You'll be prompted for the target URL (defaults to
`https://docs.eiam.admin.ch/index.php` — press Enter to accept). The
browser window stays open for manual testing (click search results, watch
console logs).

Controls while running (same as `dev-tunnel.sh`):

- `r` — rebuild and reload the page with the new build
- `q` — quit (cleans up the local server and browser)

Configurable via env vars:

```bash
# Different bundle/URL pattern to intercept
MATCH_PATTERN='**/some/other/bundle.js*' ./dev-tools/network-override/test-with-local-build.sh

# Different local port (default 8898 — distinct from dev-tunnel.sh's 8899)
LOCAL_PORT=9000 ./dev-tools/network-override/test-with-local-build.sh

# Run without opening a visible window (just logs)
HEADLESS=true ./dev-tools/network-override/test-with-local-build.sh
```

## Low-level tool

`override-and-open.js` is the generic Playwright core underneath — it can
also intercept a request and replace it with content from any arbitrary
URL (e.g. a GitHub raw file), not just a local build:

```bash
node dev-tools/network-override/override-and-open.js \
  --url "<page-to-open>" \
  --match "<url-pattern-to-intercept>" \
  --replace "<url-to-serve-instead>" \
  [--headless]
```

Send it `SIGUSR1` to reload the page on demand (e.g. after rebuilding the
file behind `--replace`) — `test-with-local-build.sh` does this when you
press `r`.

## Notes

- `--match` / `MATCH_PATTERN` accepts a Playwright glob pattern — see
  [Playwright docs: page.route()](https://playwright.dev/docs/api/class-page#page-route).
- Requires the `playwright` package (already in `devDependencies`) and a
  cached Chromium build. First run on a fresh machine: `npx playwright install chromium`.
- [`../dev-tunnel/`](../dev-tunnel/README.md) (public tunnel via
  ngrok/localtunnel) is a separate, unrelated tool — only needed when
  something *outside* your machine needs to reach the build. For testing
  against a live page in your own browser, this local-only override is
  simpler and needs no tunnel.
