
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer } from 'http';
import { router } from './routes.js';
import { initializeSocket } from './socket.js';
import { setupVite } from './vite.js';
import fs from 'fs';

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
  const root = path.join(__dirname, ".."); // The root is now the `dist` folder

  // Log the existence of index.html and directories for debugging
  if (!fs.existsSync(root)) {
    console.error(`[server] Static root not found: ${root}`);
  } else if (!fs.existsSync(path.join(root, "index.html"))) {
    console.error(`[server] index.html not found under: ${root}`);
  }

  app.use(express.static(root));

  // SPA fallback
  app.get("*", (req, res) => {
    const indexPath = path.join(root, "index.html");
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      // Clear error in logs and return 500 so the deploy doesn't "mask" the problem
      console.error(`[server] Cannot serve index.html — file missing: ${indexPath}`);
      res.status(500).send("index.html missing on server. Check build output.");
    }
  });
}

initializeSocket(server);

const PORT = process.env.PORT || 10000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
