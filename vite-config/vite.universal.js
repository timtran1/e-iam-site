import path from 'path';
import {fileURLToPath} from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * CSS inline plugin for universal build
 */
export const inlineCssPlugin = {
  name: 'inline-css',
  generateBundle(options, bundle) {
    // Find CSS assets and inline them
    const cssAssets = Object.keys(bundle).filter((key) => key.endsWith('.css'));

    cssAssets.forEach((cssAsset) => {
      const cssContent = bundle[cssAsset].source;

      // Find the main JS file
      const jsAsset = Object.keys(bundle).find(
        (key) => key.includes('app-universal') && key.endsWith('.js')
      );

      if (jsAsset && cssContent) {
        // Inject CSS into JS
        const cssInjectCode = `
(function() {
  var style = document.createElement('style');
  style.textContent = ${JSON.stringify(cssContent)};
  document.head.appendChild(style);
})();
`;
        bundle[jsAsset].code = cssInjectCode + bundle[jsAsset].code;

        // Remove the CSS asset
        delete bundle[cssAsset];
      }
    });
  },
};

/**
 * Universal build configuration
 */
export const universalConfig = {
  define: {
    // Additional defines for universal build
    'process.platform': JSON.stringify('browser'),
    'process.version': JSON.stringify(''),
    'process.versions': JSON.stringify({}),
    global: 'globalThis',
  },
  build: {
    assetsInlineLimit: 100000000, // Inline all assets for universal build
    lib: {
      entry: path.resolve(__dirname, '../src/main.universal.jsx'),
      name: 'EIamSite',
      fileName: 'app-universal',
      formats: ['iife'], // Immediately Invoked Function Expression for browser
    },
    rollupOptions: {
      external: [], // Bundle everything for standalone use
      output: {
        globals: {},
        inlineDynamicImports: true,
        assetFileNames: () => {
          // Prevent CSS files from being emitted as separate assets
          return 'assets/[name].[hash][extname]';
        },
      },
      plugins: [inlineCssPlugin],
    },
  },
};
