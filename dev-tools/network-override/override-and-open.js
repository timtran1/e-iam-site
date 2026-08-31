import {chromium} from 'playwright';

/**
 * Launches a browser, intercepts network requests matching a URL pattern,
 * and serves the response body from a replacement URL instead — without
 * touching the real server. Useful for testing an unreleased build (e.g. a
 * bundle hosted on GitHub raw) against a live production page.
 *
 * Usage:
 *   node override-and-open.js \
 *     --url "https://docs.eiam.admin.ch/index.php?c=_search&l=de&q=Formular" \
 *     --match "**\/r/design2026/design2026_de.js*" \
 *     --replace "https://raw.githubusercontent.com/anhkhuong975/bulk-api-caller/6eed7a443e15bec0ca993eb266a86d3624cca540/statics/app-universal-01.iife.js"
 *
 * Flags:
 *   --url       Page to open (required)
 *   --match     Playwright glob/URL pattern to intercept (required)
 *   --replace   URL whose response body replaces the intercepted request (required)
 *   --headless  Run without a visible window (default: false)
 *
 * Send SIGUSR1 to this process to reload the page (e.g. after rebuilding
 * the file behind --replace) — test-with-local-build.sh does this when you
 * press 'r'.
 */

const args = process.argv.slice(2);

const getArg = (name) => {
  const index = args.indexOf(`--${name}`);
  return index !== -1 ? args[index + 1] : undefined;
};

const hasFlag = (name) => args.includes(`--${name}`);

const pageUrl = getArg('url');
const matchPattern = getArg('match');
const replaceUrl = getArg('replace');
const headless = hasFlag('headless');

if (!pageUrl || !matchPattern || !replaceUrl) {
  console.error(
    'Usage: node override-and-open.js --url <page-url> --match <url-pattern> --replace <replacement-url> [--headless]'
  );
  process.exit(1);
}

const browser = await chromium.launch({headless});
const context = await browser.newContext();
const page = await context.newPage();

const shutdown = async () => {
  await browser.close().catch(() => {});
  process.exit(0);
};
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

process.on('SIGUSR1', async () => {
  console.log(`\n[reload] Reloading ${pageUrl}`);
  try {
    await page.reload({waitUntil: 'domcontentloaded'});
  } catch (err) {
    console.error(`[reload] Failed: ${err.message}`);
  }
});

await context.route(matchPattern, async (route) => {
  const requestUrl = route.request().url();
  console.log(`[override] Intercepted ${requestUrl}`);
  console.log(`[override] Serving content from ${replaceUrl}`);

  const response = await fetch(replaceUrl);
  const body = await response.text();
  const contentType =
    response.headers.get('content-type') || 'application/javascript';

  await route.fulfill({status: 200, contentType, body});
});

page.on('console', (msg) => console.log(`[page] ${msg.text()}`));
page.on('pageerror', (err) => console.error(`[page error] ${err.message}`));

await page.goto(pageUrl, {waitUntil: 'domcontentloaded'});

console.log('\nOverride active. Browser window stays open for testing.');
console.log('Press Ctrl+C to close.\n');

// Keep the process (and browser) alive until manually stopped.
await new Promise(() => {});
