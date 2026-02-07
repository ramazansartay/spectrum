import express from 'express';
import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes/index.js'; // Assuming you have a routes file

dotenv.config();

const app = express();
const port = process.env.PORT || 10000;

// Middleware
app.use(cors());
app.use(express.json());

// API routes
app.use('/api', apiRoutes);

// Serve static files from the React app
const projectRoot = process.cwd();
const publicPath = path.join(projectRoot, 'dist/public');

app.use(express.static(publicPath));

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  const indexPath = path.join(publicPath, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      console.error('Error sending file:', err);
      res.status(500).send('An error occurred while trying to serve the page.');
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
