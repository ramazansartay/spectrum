import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  root: 'client', // Указываем, что корень проекта - папка client
  build: {
    outDir: '../dist/client',
    manifest: true, // Включаем генерацию манифеста
    ssrManifest: true // Включаем генерацию SSR-манифеста
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'client/src'),
    },
  },
});
