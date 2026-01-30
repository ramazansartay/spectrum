
import { defineConfig } from 'vite';
import { resolve } from 'path';

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
});
