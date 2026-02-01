import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  publicDir: false, // Сборка сервера не должна включать статичные файлы из /public
  resolve: {
    // Псевдоним для разрешения импортов на стороне сервера
    alias: {
      '@': path.resolve(__dirname, 'client/src'),
    },
  },
  build: {
    // Генерация сборки для сервера (SSR)
    ssr: 'server/index.ts',
    outDir: 'dist-server',
    // Очистка директории перед сборкой
    emptyOutDir: true,
  },
});
