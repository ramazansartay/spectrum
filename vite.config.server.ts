import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    ssr: 'client/entry-server.tsx',
    outDir: 'dist/server',
  },
  // Эта опция нужна, чтобы Vite знал, где искать исходники
  resolve: {
    alias: {
      '@': '/client/src'
    }
  }
});
