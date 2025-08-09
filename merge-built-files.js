import path from 'path';
import fs from 'fs/promises';
import {minify} from 'terser';

console.log('Start - Merging built files...');

const distDir = 'dist';
const htmlPath = path.join(distDir, 'index.html');
let html = await fs.readFile(htmlPath, 'utf-8');

const reactScriptRegex =
  /<script type="module" crossorigin [^>]*src="\/assets\/(index[^"]+\.js)"[^>]*><\/script>/;

/**
 * Minify js content
 * Returns original content if catching error
 *
 * @param {string} jsContent
 * @returns {Promise<string>}
 */
const minifyJsContent = async (jsContent) => {
  // Minify the JS content
  console.log('Minifying JavaScript code...');
  try {
    const minifyResult = await minify(jsContent, {
      compress: {
        drop_console: true,
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

const match = html.match(reactScriptRegex);
if (!match) {
  console.error(`Error: Could not find the <script> tag to inline.`);
} else {
  // Merge the built js file to html file
  const jsTag = match[0];
  const jsFilename = match[1];
  const jsFilePath = path.join(distDir, 'assets', jsFilename);
  const jsContent = await fs.readFile(jsFilePath, 'utf-8');

  // Minify the JS content
  const minifiedJsContent = await minifyJsContent(jsContent);
  const inlineScript = `<script type="module" crossorigin>\n${minifiedJsContent}\n</script>`;
  html = html.split(jsTag).join(inlineScript);

  // Insert cssbase.css to html
  const cssBasePositionHook = `<!--CSS_BASE-->`;
  const cssBaseTag = `<link rel="stylesheet" href="/r/cssbase.css" type="text/css"/>`;
  html = html.replace(cssBasePositionHook, cssBaseTag);

  // Save file
  await fs.writeFile(htmlPath, html, 'utf-8');

  // Delete file js
  await fs.unlink(jsFilePath);

  console.log('Finished - Successfully minified, merged and inlined assets.');
}
