import path from 'path';
import {fileURLToPath} from 'node:url';
import {minifyJsContent} from './minify-js.js';

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
        // Inject CSS into JS (without minification, same as original)
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
 * JavaScript minify plugin for universal build
 * Uses the shared minifyJsContent from ./minify-js.js
 */
export const minifyJsPlugin = {
  name: 'minify-js',
  async generateBundle(options, bundle) {
    // Find JS assets and minify them
    const jsAssets = Object.keys(bundle).filter(
      (key) => key.includes('app-universal') && key.endsWith('.js')
    );

    for (const jsAsset of jsAssets) {
      const jsContent = bundle[jsAsset].code;

      // Minify the JS content using same function as merge-built-files.js
      bundle[jsAsset].code = await minifyJsContent(jsContent);
    }
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
    minify: false, // Disable Vite's default minification, use our custom plugin
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
        compact: true, // Enable compact output
        assetFileNames: () => {
          // Prevent CSS files from being emitted as separate assets
          return 'assets/[name].[hash][extname]';
        },
      },
      plugins: [inlineCssPlugin, minifyJsPlugin],
    },
    // Additional optimization options
    target: 'es2015', // Target modern browsers for better optimization
    sourcemap: false, // Disable sourcemaps for production build
    reportCompressedSize: true, // Report compressed size
    chunkSizeWarningLimit: 1000, // Increase chunk size warning limit
  },
};
