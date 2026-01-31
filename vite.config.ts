
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Client configuration
export default defineConfig({
  plugins: [react()],
  // Project root - 'client', all paths within it
  root: 'client', 
  build: {
    // Output directory relative to the project root
    outDir: '../dist/public',
    // Clear the public folder before each client build
    emptyOutDir: true, 
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared"),
      "@assets": path.resolve(__dirname, "attached_assets"),
    },
  },
});
