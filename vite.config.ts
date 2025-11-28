import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',
  publicDir: 'public', // Specify explicitly
  build: {
    outDir: 'dist',
    target: 'es2015', // Critical for iOS compatibility
    cssTarget: 'chrome61',
  },
});