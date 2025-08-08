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
        drop_console: false,
        drop_debugger: true,
        pure_funcs: ['console.debug'],
      },
      mangle: true,
      format: {
        comments: false,
      },
    });

    // Check error
    if (minifyResult.error) {
      console.error('Minification error:', minifyResult.error);
      return jsContent;
    }

    // Write log - minified completely
    const minifiedJsContent = minifyResult.code;
    console.log(`Minified size: ${minifiedJsContent.length} bytes`);

    // Returns minified js content
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
  const minifiedJsContent = minifyJsContent(jsContent);
  const inlineScript = `<script type="module" crossorigin>${minifiedJsContent}</script>`;
  html = html.split(jsTag).join(inlineScript);

  // Insert cssbase.css to html
  const cssBasePositionHook = `<!--CSS_BASE-->`;
  const cssBaseTag = `<link rel="stylesheet" href="/r/cssbase.css" type="text/css"/>`;
  html = html.replace(cssBasePositionHook, cssBaseTag);

  // Save file
  await fs.writeFile(htmlPath, html, 'utf-8');

  // Delete file js
  await fs.unlink(jsFilePath);

  console.log('Finished - Successfully merged and inlined assets.');
}
