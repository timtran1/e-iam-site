const inlineJS = () => {
  return {
    name: 'vite:inline-js',
    apply: 'build',
    enforce: 'post',
    async generateBundle(_, bundle) {
      const htmlFile = Object.keys(bundle).find((file) =>
        file.endsWith('.html')
      );
      const jsFile = Object.keys(bundle).find((file) => file.endsWith('.js'));

      if (!htmlFile || !jsFile) return;

      const htmlChunk = bundle[htmlFile];
      const jsChunk = bundle[jsFile];

      if (htmlChunk.type === 'asset' && jsChunk.type === 'chunk') {
        const html = htmlChunk.source;
        const jsCode = jsChunk.code;

        htmlChunk.source = html.replace(
          `<script type="module" crossorigin src="/${jsFile}"></script>`,
          `<script type="module">\n${jsCode}\n</script>`
        );

        delete bundle[jsFile];
      }
    },
  };
};

export default inlineJS;
