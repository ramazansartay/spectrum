import express from 'express';
import http from 'http';
import path from 'path'; // Импортируем 'path'
import { init as initSocket } from './socket';
import { logger } from './logger';
import { api } from './routes';
import { auth } from './auth';
import config from './config';

const app = express();
const server = http.createServer(app);

// Инициализация сокетов
initSocket(server);

// Middleware для парсинга JSON
app.use(express.json());

// Middleware для логирования и API-маршрутов
app.use(logger);
app.use('/api', auth);
app.use('/api', api);

// Обслуживание статических файлов из сборки React
const clientBuildPath = path.resolve(__dirname, '../client');
app.use(express.static(clientBuildPath));

// Обработчик "catchall": для любого запроса, который не совпал с маршрутами выше,
// отправляем основной файл index.html вашего React-приложения.
app.get('*', (req, res) => {
  res.sendFile(path.resolve(clientBuildPath, 'index.html'));
});

const { port } = {
  port: process.env.PORT || 3000,
};

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
