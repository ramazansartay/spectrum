
import { defineConfig } from "vite";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Конфигурация для СЕРВЕРА
export default defineConfig({
  // Указываем, что это сборка для SSR
  ssr: {
    // Явно указываем Vite не включать эти модули в бандл,
    // так как они будут доступны в Node.js окружении
    noExternal: [/@mui\/material/], 
  },
  // Целевая среда - Node.js
  publicDir: false, // Не копировать содержимое public/ папки для серверной сборки
  build: {
    // Выходная директория для сервера
    outDir: path.resolve(__dirname, "dist"),
    // НЕ очищать outDir, чтобы не удалить клиентский билд
    emptyOutDir: false, 
    // Собираем как SSR
    ssr: true,
    rollupOptions: {
      // Входная точка сервера
      input: path.resolve(__dirname, "server", "index.ts"),
      output: {
        // Формат выходного файла
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
