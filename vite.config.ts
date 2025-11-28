
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/', // CRITICAL: Use absolute root path for Netlify + PWA
  publicDir: 'public',
  build: {
    outDir: 'dist',
    target: 'es2015', // CRITICAL: Older target prevents white screen on older iOS
    cssTarget: 'chrome61',
  },
});
