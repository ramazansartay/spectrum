
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// Конфигурация для КЛИЕНТА
export default defineConfig({
  plugins: [react()],
  // Корень проекта - 'client', все пути внутри него
  root: 'client', 
  build: {
    // Выходная директория относительно корня проекта
    outDir: '../dist/public',
    // Очищать папку public перед каждой сборкой клиента
    emptyOutDir: true, 
  },
});
