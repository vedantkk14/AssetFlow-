import type { Config } from 'tailwindcss';

// TODO: Extend theme (colors, fonts) to match ShadCN design tokens
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config;
