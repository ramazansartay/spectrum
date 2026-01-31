import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  root: 'client', // Указываем Vite, где корень нашего клиентского приложения
  plugins: [react()],
  build: {
    outDir: '../dist-client', // Явно указываем выходную директорию относительно корня (client)
    sourcemap: true, // Включаем sourcemap для более легкой отладки
    emptyOutDir: true, // Очищаем папку сборки перед каждой сборкой
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});
