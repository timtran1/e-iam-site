import {minify} from 'terser';

/**
 * Minify js content
 * Returns original content if catching error
 *
 * @param {string} jsContent
 * @returns {Promise<string>}
 */
export const minifyJsContent = async (jsContent) => {
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
        // Escape non-ASCII chars (e.g. German "Ü") to \uXXXX so the bundle
        // stays valid regardless of what charset u5CMS serves/stores it with.
        ascii_only: true,
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
