
import { defineConfig } from "vite";
import path from "path";
import { fileURLToPath } from 'url';
import { dependencies } from './package.json';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Server configuration
export default defineConfig({
  ssr: {
    // Externalize all dependencies to avoid bundling them
    external: Object.keys(dependencies),
  },
  publicDir: false, // Do not copy the public/ folder for the server build
  build: {
    // Output directory for the server
    outDir: path.resolve(__dirname, "dist/server"),
    // Do not clear the outDir, so as not to delete the client build
    emptyOutDir: true, 
    // Build as SSR
    ssr: true,
    rollupOptions: {
      // Server entry point
      input: path.resolve(__dirname, "server", "index.ts"),
      output: {
        // Output file format
        format: 'es',
        entryFileNames: "[name].js",
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared"),
      "@assets": path.resolve(__dirname, "attached_assets"),
    },
  },
});
