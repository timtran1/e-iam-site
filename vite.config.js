import {defineConfig} from 'vite';
import {getViteConfig} from './vite-config/index.js';

export default defineConfig(({mode}) => {
  return getViteConfig(mode);
});
