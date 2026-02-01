import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  publicDir: false,
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'client/src'),
    },
  },
  build: {
    // Теперь мы собираем ТОЛЬКО entry-server.tsx в SSR-бандл
    ssr: 'client/src/entry-server.tsx',
    outDir: 'dist-server',
    emptyOutDir: true,
  },
});
