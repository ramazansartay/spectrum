
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer } from 'http';
import { router } from './routes.js';
import { initializeSocket } from './socket.js';
import { setupVite } from './vite.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = createServer(app);

app.use(cors());
app.use(express.json());

// API routes
app.use('/api', router);

// Vite dev middleware
if (process.env.NODE_ENV !== 'production') {
  setupVite(server, app);
} 

// Production static server
if (process.env.NODE_ENV === 'production') {
  const publicPath = path.join(__dirname, 'public');
  app.use(express.static(publicPath));

  app.get('*', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
  });
}

initializeSocket(server);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
