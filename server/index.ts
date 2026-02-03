import express from 'express';
import http from 'http';
import { init as initSocket } from './socket.js';
import { logger } from './logger.js';
import { api } from './routes.js';
import { auth } from './auth.js';
import config from './config.js';

const app = express();
const server = http.createServer(app);

initSocket(server);

app.use(express.static('dist/client'));
app.use(logger);
app.use(auth);
app.use('/api', api);

const { port } = {
  port: process.env.PORT || 10000,
};

server.listen(port, () => {
  console.log(`Attempting to listen on 0.0.0.0:${port}`);
});
