'use strict';
// Tests for src/lowstage-guard.js and how the build places it in the bundle.
// Based on lowstage.test.cjs of 2026-10-16. Run `npm run build`, then `npm test`.
// BUNDLE=<path> tests another build (e.g. the uploaded design2026_de.js).
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const root = path.join(__dirname, '..');
const prefix = fs.readFileSync(path.join(root, 'src/lowstage-guard.js'), 'utf8');
const bundlePath = process.env.BUNDLE || path.join(root, 'dist/app-universal.iife.js');
let bundleCode;
function bundle() {
  if (bundleCode === undefined) {
    if (!fs.existsSync(bundlePath)) throw Error(bundlePath + ' not found, run npm run build first');
    bundleCode = fs.readFileSync(bundlePath, 'utf8');
  }
  return bundleCode;
}
const tests = [];
function test(name, fn) { tests.push([name, fn]); }
function run(href, options = {}) {
  const url = new URL(href);
  const result = { alerts: [], redirects: [], cookieWrites: [], cookieReads: 0, bodyRan: false };
  const document = {
    // The guard never creates elements; the rest of the bundle starts by
    // injecting its CSS, so this call marks "the redesign started".
    createElement() { result.bodyRan = true; throw Error('bundle body ran'); }
  };
  Object.defineProperty(document, 'cookie', {
    get() { result.cookieReads++; if (options.readThrows) throw Error('Blocked'); return options.cookie || ''; },
    set(value) { if (options.writeThrows) throw Error('Blocked'); result.cookieWrites.push(value); }
  });
  const window = {
    location: { protocol: url.protocol, hostname: url.hostname, port: url.port,
      pathname: url.pathname, search: url.search, hash: url.hash,
      replace(value) { result.redirects.push(value); } },
    alert(value) { result.alerts.push(value); if (options.alertThrows) throw Error('Alert unavailable'); }
  };
  window.self = window;
  window.top = options.iframe ? {} : window;
  result.window = window;
  const code = options.code || prefix;
  const context = vm.createContext({ window, document, URLSearchParams, Date });
  try { vm.runInContext(code, context); } catch (error) { result.error = error.message; }
  if (options.twice) vm.runInContext(code, context);
  return result;
}

// The built bundle.
test('Built bundle parses', () => { new vm.Script(bundle()); });
test('Built bundle starts with the unchanged guard', () => {
  assert.ok(bundle().startsWith(prefix));
});
test('Built bundle on a stage redirects and runs nothing else', () => {
  const r = run('https://docs-r.eiam.admin.ch/index.php?c=test&l=de', { code: bundle() });
  assert.deepEqual(r.redirects, ['https://docs.eiam.admin.ch/index.php?c=test&l=de']);
  assert.equal(r.bodyRan, false);
  assert.equal(r.error, undefined);
});
test('Built bundle on production runs the redesign', () => {
  const r = run('https://docs.eiam.admin.ch/index.php?c=test&l=de', { code: bundle() });
  assert.equal(r.redirects.length, 0);
  assert.equal(r.bodyRan, true);
});
test('Built bundle on a stage with lowstage=on runs the redesign', () => {
  const r = run('https://docs-r.eiam.admin.ch/?lowstage=on', { code: bundle() });
  assert.equal(r.redirects.length, 0);
  assert.equal(r.bodyRan, true);
});
test('Built bundle on a stage with the opt-in cookie runs the redesign', () => {
  const r = run('https://docs-r.eiam.admin.ch/', { code: bundle(), cookie: 'lowstage=on' });
  assert.equal(r.redirects.length, 0);
  assert.equal(r.bodyRan, true);
});
test('Guard is ASCII only and has no double braces (u5admin)', () => {
  assert.doesNotMatch(prefix, /[^\x00-\x7f]/);
  assert.doesNotMatch(prefix, /\{\{|\}\}/);
});
test('Only a redirect sets the skip flag', () => {
  assert.equal(run('https://docs-r.eiam.admin.ch/').window.__design2026LowstageRedirect, true);
  assert.equal(run('https://docs-r.eiam.admin.ch/?lowstage=on').window.__design2026LowstageRedirect, undefined);
  assert.equal(run('https://docs-r.eiam.admin.ch/', { cookie: 'lowstage=on' }).window.__design2026LowstageRedirect, undefined);
  assert.equal(run('https://docs.eiam.admin.ch/').window.__design2026LowstageRedirect, undefined);
});

// The guard on its own.
for (const [domain, families] of [
  ['eiam.admin.ch', ['www', 'docs', 'help', 'box', 'check', 'dossier', 'syn']],
  ['agov.ch', ['www', 'info', 'help', 'bund', 'steering', 'org', 'supportmanual', 'work', 'ops']]
]) {
  for (const family of families) for (const stage of ['a', 'r']) {
    for (const alias of ['', 'www.']) {
      test(`${alias}${family}-${stage}.${domain} maps to its production CMS host`, () => {
        const result = run(`https://${alias}${family}-${stage}.${domain}/index.php?c=test&l=fr#part`);
        assert.deepEqual(result.redirects, [`https://${family}.${domain}/index.php?c=test&l=fr#part`]);
        assert.equal(result.alerts.length, 1);
      });
    }
    test(`${family}-${stage}.${domain}: explicit opt-in persists for 30 days`, () => {
      const before = Date.now();
      const result = run(`https://${family}-${stage}.${domain}/?lowstage=on`);
      assert.equal(result.redirects.length, 0);
      assert.equal(result.cookieWrites.length, 1);
      const cookie = result.cookieWrites[0];
      assert.match(cookie, /^lowstage=on; expires=/);
      assert.match(cookie, /; path=\/; SameSite=Lax; Secure$/);
      assert.doesNotMatch(cookie, /domain=/i);
      const expiry = Date.parse(cookie.match(/expires=([^;]+)/)[1]);
      assert.ok(Math.abs(expiry - before - 30 * 86400000) < 2000);
    });
    test(`${family}-${stage}.${domain}: existing opt-in is honoured`, () => {
      assert.equal(run(`https://${family}-${stage}.${domain}/`, { cookie: 'theme=dark; lowstage=on; x=1' }).redirects.length, 0);
    });
  }
  for (const family of families) test(`PROD ${family}.${domain} remains unchanged`, () => {
    const r = run(`https://${family}.${domain}/?lowstage=on&q=https://docs-r.eiam.admin.ch`);
    assert.equal(r.redirects.length + r.cookieWrites.length + r.alerts.length + r.cookieReads, 0);
  });
}
test('Path, query, fragment, encoded characters, repeated parameters and port are preserved', () => {
  const r = run('https://docs-r.eiam.admin.ch:8443/files/file-r.pdf?c=a%21b&next=https%3A%2F%2Fhelp-r.eiam.admin.ch%2F&x=a+b&x=%20&literal=foo-a.bar#part-r.one');
  assert.equal(r.redirects[0], 'https://docs.eiam.admin.ch:8443/files/file-r.pdf?c=a%21b&next=https%3A%2F%2Fhelp-r.eiam.admin.ch%2F&x=a+b&x=%20&literal=foo-a.bar#part-r.one');
});
for (const cookie of ['lowstage=on', 'x=1;lowstage=on', 'x=1; lowstage=on; y=2'])
  test('Recognises exact cookie: ' + cookie, () => assert.equal(run('https://docs-r.eiam.admin.ch/', { cookie }).redirects.length, 0));
for (const cookie of ['notlowstage=on', 'lowstage=only', 'lowstage=ON', 'lowstage=off', 'x=lowstage=on'])
  test('Does not recognise unrelated cookie: ' + cookie, () => assert.equal(run('https://docs-r.eiam.admin.ch/', { cookie }).redirects.length, 1));
test('Opt-in uses a real query parameter, including percent-encoded value', () => {
  assert.equal(run('https://docs-r.eiam.admin.ch/?x=1&lowstage=%6Fn').redirects.length, 0);
  assert.equal(run('https://docs-r.eiam.admin.ch/?notlowstage=on').redirects.length, 1);
  assert.equal(run('https://docs-r.eiam.admin.ch/#lowstage=on').redirects.length, 1);
});
test('Preserves first-value query semantics and existing off behaviour', () => {
  assert.equal(run('https://docs-r.eiam.admin.ch/?lowstage=off&lowstage=on').redirects.length, 1);
  assert.equal(run('https://docs-r.eiam.admin.ch/?lowstage=off', {cookie: 'lowstage=on'}).redirects.length, 0);
});
test('Cookie write failure does not cancel explicit opt-in', () => {
  const r = run('https://docs-r.eiam.admin.ch/?lowstage=on', { writeThrows: true });
  assert.equal(r.redirects.length, 0); assert.equal(r.error, undefined);
});
test('Cookie read failure redirects to production', () => {
  assert.equal(run('https://docs-r.eiam.admin.ch/', { readThrows: true }).redirects.length, 1);
});
test('Embedded frames/previews are not redirected or given cookies', () => {
  for (const query of ['', '?lowstage=on']) {
    const r = run('https://docs-r.eiam.admin.ch/' + query, { iframe: true });
    assert.equal(r.redirects.length + r.cookieWrites.length + r.cookieReads + r.alerts.length, 0);
  }
});
for (const host of ['feds-r.eiam.admin.ch', 'myaccount-a.eiam.admin.ch', 'www.portal-r.eiam.admin.ch',
  'testla1.testapp-r.eiam.admin.ch', 'info-r.agov.ch.example.org', 'docs-t.eiam.admin.ch',
  'docs-r.eiam.swiss', 'unknown-r.agov.ch', 'localhost'])
  test('Unlisted/non-CMS host is not redirected: ' + host, () => assert.equal(run('https://' + host + '/').redirects.length, 0));
test('Non-HTTP schemes are not handled', () => assert.equal(run('file:///tmp/docs-r.eiam.admin.ch').redirects.length, 0));
test('Duplicate prelude execution does not repeat the warning/navigation', () => {
  const r = run('https://docs-r.eiam.admin.ch/', { twice: true });
  assert.equal(r.redirects.length, 1); assert.equal(r.alerts.length, 1);
});
test('Navigation is still requested if alert throws', () => assert.equal(run('https://docs-r.eiam.admin.ch/', { alertThrows: true }).redirects.length, 1));
test('HTTP opt-in does not request a Secure cookie', () => assert.doesNotMatch(run('http://docs-r.eiam.admin.ch/?lowstage=on').cookieWrites[0], /Secure/));

let failures = 0;
for (const [name, fn] of tests) {
  try { fn(); console.log('PASS ' + name); }
  catch (error) { failures++; console.error('FAIL ' + name + ': ' + error.message); }
}
console.log(`${tests.length - failures}/${tests.length} passed`);
process.exitCode = failures ? 1 : 0;
