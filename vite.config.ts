import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Ensures relative paths for assets
  publicDir: 'public', // Files in here will be copied to root on build
  build: {
    outDir: 'dist',
    target: 'es2015', // Older target prevents white screen on older iOS
    cssTarget: 'chrome61',
  },
});