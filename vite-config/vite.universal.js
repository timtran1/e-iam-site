import path from 'path';
import {fileURLToPath} from 'node:url';
import {minify} from 'terser';

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
 * Minify js content
 * Returns original content if catching error
 * Same function as merge-built-files.js
 *
 * @see merge-built-files.js
 * @param {string} jsContent
 * @returns {Promise<string>}
 */
const minifyJsContent = async (jsContent) => {
  // Minify the JS content
  console.log('Minifying JavaScript code...');
  try {
    const minifyResult = await minify(jsContent, {
      compress: {
        drop_console: false,
        drop_debugger: true,
        sequences: true,
        properties: true,
        dead_code: true,
        conditionals: true,
        comparisons: true,
        evaluate: true,
        booleans: true,
        loops: true,
        unused: true,
        if_return: true,
        join_vars: true,
        side_effects: true,
        unsafe: false, // avoid hidden breakage
      },
      mangle: true,
      format: {
        comments: false,
        max_line_len: 200,
        semicolons: true,
        wrap_func_args: true,
      },
    });

    // Check error
    if (minifyResult.error) {
      console.error('Minification error:', minifyResult.error);
      return jsContent;
    }

    // Fix for u5admin: insert a space after a closing brace if another closing brace follows immediately.
    // This prevents '{{var}}' patterns from breaking the u5admin template parser after minification.
    let minifiedJsContent = minifyResult.code;
    minifiedJsContent = minifiedJsContent.replace(/}(?=})/g, '} ');

    // Write log - minified completely
    console.log('Minified JS content successfully');

    // Returns minified js content with break lines
    return minifiedJsContent;
  } catch (e) {
    console.error('Can not minify js content:', e);
    return jsContent;
  }
};

/**
 * JavaScript minify plugin for universal build
 * Uses same configuration as merge-built-files.js
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
