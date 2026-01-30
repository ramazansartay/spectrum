
import { defineConfig } from 'vite';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = resolve(__filename, '..');

export default defineConfig({
  build: {
    // Relative to the root
    outDir: 'dist/server',
    ssr: true,
    rollupOptions: {
      input: {
        // Entry point for the server
        index: resolve(__dirname, 'server', 'index.ts'),
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'client', 'src'),
      '@shared': resolve(__dirname, 'shared'),
      '@assets': resolve(__dirname, 'attached_assets'),
    },
  },
});
