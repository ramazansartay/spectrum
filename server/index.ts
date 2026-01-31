
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer } from 'http';
import morgan from 'morgan';
import { router } from './routes.js';
import { initializeSocket } from './socket.js';
import { setupVite } from './vite.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isProduction = process.env.NODE_ENV === 'production';

const app = express();
const server = createServer(app);

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use('/api', router);

if (isProduction) {
  const clientBuildPath = path.resolve(__dirname, '../client');
  app.use('/locales', express.static(path.resolve(clientBuildPath, 'locales')));
  app.use(express.static(clientBuildPath));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(clientBuildPath, 'index.html'));
  });
} else {
  setupVite(server, app);
}

initializeSocket(server);

const PORT = process.env.PORT || 10000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
