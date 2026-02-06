import express from 'express';
import http from 'http';
import path from 'path';
import fs from 'fs'; // Added for diagnostics
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

// --- Start Diagnostic Logging ---
try {
    const serverDir = __dirname;
    const distDir = path.resolve(serverDir, '..');

    console.log('--- DIAGNOSTICS START ---');
    console.log(`Server directory (__dirname): ${serverDir}`);
    console.log(`Parent of server directory (expected dist): ${distDir}`);
    console.log(`Contents of ${distDir}:`, fs.readdirSync(distDir));
    
    const publicPath = path.resolve(serverDir, '../public');
    console.log(`Attempting to use static path: ${publicPath}`);
    
    console.log(`Contents of ${publicPath}:`, fs.readdirSync(publicPath));

    app.use(express.static(publicPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(publicPath, 'index.html'));
    });
    console.log('--- DIAGNOSTICS END: Successfully set static path. ---');

} catch (error) {
    console.error('--- DIAGNOSTICS END: FAILED to set static path. ---');
    console.error(error);
}
// --- End Diagnostic Logging ---


const { port } = {
  port: process.env.PORT || 3000,
};

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
