import express from 'express';
import http from 'http';
import path from 'path';
import { init as initSocket } from './socket';
import { logger } from './logger';
import { api } from './routes';
import { auth } from './auth';
import config from './config';

const app = express();
const server = http.createServer(app);

initSocket(server);

app.use(express.json());

app.use(logger);
app.use('/api', auth);
app.use('/api', api);

// Correctly serve static files from the ../public folder
const publicPath = path.resolve(__dirname, '../public');
app.use(express.static(publicPath));

// Return index.html for all other requests
app.get('*', (req, res) => {
  res.sendFile(path.resolve(publicPath, 'index.html'));
});

const { port } = {
  port: process.env.PORT || 3000,
};

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
