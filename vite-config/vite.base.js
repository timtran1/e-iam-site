import react from '@vitejs/plugin-react-swc';
import path from 'path';
import {fileURLToPath} from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Base configuration shared between all modes
 */
export const baseConfig = {
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '../src'),
    },
  },
  build: {
    target: 'es2018',
    minify: 'terser',
    sourcemap: false,
    cssCodeSplit: false,
    brotliSize: false,
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
  },
};

/**
 * Get base define configuration
 * @param {string} mode - Build mode
 * @returns {Object} Define configuration
 */
export function getDefineConfig(mode) {
  return {
    'process.env': {},
    'process.env.NODE_ENV': JSON.stringify(
      mode === 'development' ? 'development' : 'production'
    ),
  };
}
