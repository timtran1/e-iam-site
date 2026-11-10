/* design2026 lowstage guard.
 *
 * Non-production CMS stages (<site>-a / <site>-r) warn the visitor and redirect
 * to the production host. Adding ?lowstage=on opts in and sets a host-only
 * cookie for 30 days, the same cookie the old guard in the u5cms
 * jsmobilespecific resource used (that one only loads with x=usetheotherlayout
 * now). Navigation aid only: this is not authentication or access control.
 *
 * Based on lowstage-guard.js of 2026-10-16. vite-config/vite.universal.js
 * minifies this file on its own, puts it at the start of the bundle and skips
 * the rest of the bundle when window.__design2026LowstageRedirect is set. It
 * is not transpiled, so keep it plain ES5.
 * Tests: tests/lowstage.test.cjs (npm test, after npm run build) run against
 * the minified copy in the bundle.
 */
(function () {
  'use strict';

  if (window.top !== window.self) return;
  if (window.__design2026LowstageGuardRan) return;
  window.__design2026LowstageGuardRan = true;

  var loc = window.location;
  if (loc.protocol !== 'https:' && loc.protocol !== 'http:') return;

  // Explicit CMS families. Do not redirect IAM/login/API/test applications.
  // Optional www. aliases resolve to the canonical production hostname.
  var hostname = loc.hostname.toLowerCase().replace(/\.$/, '');
  var eiam =
    /^(?:www\.)?(www|docs|help|box|check|dossier|syn)-(a|r)\.eiam\.admin\.ch$/.exec(
      hostname
    );
  var agov =
    /^(?:www\.)?(www|info|help|bund|steering|org|supportmanual|work|ops)-(a|r)\.agov\.ch$/.exec(
      hostname
    );
  var productionHost = eiam
    ? eiam[1] + '.eiam.admin.ch'
    : agov
      ? agov[1] + '.agov.ch'
      : '';
  if (!productionHost) return;

  var explicitOptIn = new URLSearchParams(loc.search).get('lowstage') === 'on';
  if (explicitOptIn) {
    // Keep the existing 30-day, host-only opt-in. A blocked cookie must not
    // stop an explicit lowstage=on URL from working for this request.
    try {
      document.cookie =
        'lowstage=on; expires=' +
        new Date(Date.now() + 30 * 86400000).toUTCString() +
        '; path=/; SameSite=Lax' +
        (loc.protocol === 'https:' ? '; Secure' : '');
    } catch (error) {
      // Without cookies the opt-in must be repeated on later page loads.
    }
    return;
  }

  var optedIn = false;
  try {
    optedIn = /(?:^|;)\s*lowstage\s*=\s*on\s*(?:;|$)/.test(document.cookie);
  } catch (error) {
    // No readable opt-in: use the normal production destination.
  }
  if (optedIn) return;

  // Change the hostname only. Keep path, query, fragment and explicit port.
  // Never run replace(/-r\./g, '.') on the full URL.
  var target =
    loc.protocol +
    '//' +
    productionHost +
    (loc.port ? ':' + loc.port : '') +
    loc.pathname +
    loc.search +
    loc.hash;
  // Tells the rest of the bundle not to restyle or render this page.
  window.__design2026LowstageRedirect = true;
  try {
    window.alert(
      'THIS IS A NON PRODUCTIVE STAGE. THEREFORE YOU ARE DIVERTED TO THE PRODUCTIVE STAGE. TO OVERRULE THIS, ADD THE GET-PARAMETER lowstage=on TO YOUR NON-PROD-URL'
    );
  } finally {
    // replace() keeps the stage page out of history, so Back does not loop.
    loc.replace(target);
  }
})();
