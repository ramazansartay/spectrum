
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { router } from './routes.ts';
import { initializeSocket } from './socket.ts';
import { setupVite } from './vite.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());

// API-роуты
app.use('/api', router);

// Настройка Vite в режиме разработки
if (process.env.NODE_ENV !== 'production') {
  setupVite(app);
}

// Статические файлы и SPA в режиме production
if (process.env.NODE_ENV === 'production') {
  const publicPath = path.resolve(__dirname, 'public');
  app.use(express.static(publicPath));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(publicPath, 'index.html'));
  });
}

const server = initializeSocket(app);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
