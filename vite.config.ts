import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vitejs.dev/config/
export default defineConfig({
  root: 'client',
  plugins: [react(), tsconfigPaths()],
  build: {
    outDir: '../dist/public',
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:10000',
        changeOrigin: true,
      },
    },
  },
})
