import colors from './tailwind-config/colors.js';
import fontSize from './tailwind-config/fontSize.js';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'], // or more paths if needed
  theme: {
    extend: {
      colors,
      fontSize,
    },
  },
  plugins: [],
};
