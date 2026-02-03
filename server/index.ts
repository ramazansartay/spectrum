import express from 'express';
import http from 'http';
import { init as initSocket } from './socket';
import { logger } from './logger';
import { api } from './routes';
import { auth } from './auth';
import config from './config';

const app = express();
const server = http.createServer(app);

initSocket(server);

app.use(express.json()); // Для парсинга JSON-тел запросов
app.use(express.static('dist/client'));
app.use(logger);
app.use('/api', auth); // Подключаем маршруты аутентификации
app.use('/api', api);

const { port } = {
  port: process.env.PORT || 3000,
};

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
