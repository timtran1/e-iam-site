import path from 'path';
import fs from 'fs/promises';

console.log('Start - Merging built files...');

const distDir = 'dist';
const htmlPath = path.join(distDir, 'index.html');
let html = await fs.readFile(htmlPath, 'utf-8');

const reactScriptRegex =
  /<script type="module" crossorigin [^>]*src="\/assets\/(index[^"]+\.js)"[^>]*><\/script>/;

const match = html.match(reactScriptRegex);
if (!match) {
  console.error(`Error: Could not find the <script> tag to inline.`);
} else {
  // Merge built the js file to html file
  const jsTag = match[0];
  const jsFilename = match[1];
  const jsFilePath = path.join(distDir, 'assets', jsFilename);
  const jsContent = await fs.readFile(jsFilePath, 'utf-8');
  const inlineScript = `<script type="module" crossorigin>\n${jsContent}\n</script>`;
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
