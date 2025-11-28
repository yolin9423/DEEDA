import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',
  publicDir: 'public', // Ensure public folder is copied
  build: {
    outDir: 'dist',
    target: 'es2015', // Critical for iOS compatibility to prevent white screen
    cssTarget: 'chrome61', // Prevent CSS issues on older devices
  },
});