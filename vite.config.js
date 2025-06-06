import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    target: 'es2018',
    minify: 'terser',
    sourcemap: false,
    cssCodeSplit: false,
    assetsInlineLimit: 0,
    terserOptions: {
      compress: {
        drop_console: false,
        drop_debugger: true,
        passes: 3,
        dead_code: true,
        unsafe_arrows: true,
        toplevel: true,
      },
      mangle: {
        toplevel: true,
      },
      format: {
        beautify: true,
        indent_level: 2,
        comments: false,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: undefined,
        inlineDynamicImports: true,
      },
    },
    brotliSize: false,
  },
});
