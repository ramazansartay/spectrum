
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Client configuration
export default defineConfig({
  plugins: [react()],
  publicDir: path.resolve(__dirname, 'public'),
  // root is now 'client', where this config is. No root option needed.
  build: {
    // Output directory is now relative to 'client'
    outDir: '../dist/client',
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      // '@' now points to 'src' relative to this config's location
      "@": path.resolve(__dirname, "src"), 
      // '@shared' needs to go up one level
      "@shared": path.resolve(__dirname, "..", "shared"),
      "@assets": path.resolve(__dirname, "..", "attached_assets"),
    },
  },
});
