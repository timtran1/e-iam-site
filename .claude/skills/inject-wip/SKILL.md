# Inject WIP Build into Live eIAM Site

Test local changes on the live site by replacing the production script with a local build.

## Constraints

- `x=usetheotherlayout` skips both production AND our injected script (both check this param). Don't use it for injection testing.
- The production script (`design2026_de.js`) loads via `<script src>` on every page. Our build is `dist/app-universal.iife.js`.

## Method: Build + Inject via eval

```bash
# 1. Build
npm run build

# 2. Open page in browser (production theme loads automatically)
pwt -s=<name> tab-new 'https://docs.eiam.admin.ch/index.php?c=_search&l=de&q=Formular'

# 3. Inject local build (runs AFTER production, so it re-initializes)
JS_CONTENT=$(cat dist/app-universal.iife.js)
pwt -s=<name> eval "async () => {
  const s = document.createElement('script');
  s.textContent = $(python3 -c "import json, sys; print(json.dumps(sys.stdin.read()))" <<< "$JS_CONTENT");
  document.head.appendChild(s);
  return 'injected';
}"
```

## Method: Logic-only verification

When full injection conflicts with the already-loaded production script, verify fix logic directly:

```bash
# Extract data from old theme
pwt -s=<name> tab-new 'https://...&x=usetheotherlayout'
pwt -s=<name> eval "() => { /* extract hrefs from old theme h5 > a tags */ }"

# Run fixed logic against extracted data on the new theme page
pwt -s=<name> goto 'https://...'  # loads production theme
pwt -s=<name> eval "() => { /* run fixed computation, compare outputs */ }"
```

## Notes

- Production script URL: `https://www.eiam.admin.ch/r/design2026/design2026_<lang>.js`
- The injected IIFE re-runs initialization, which works for most cases since it creates a new React root
- For CSS-only changes, injection works cleanly since styles just override
