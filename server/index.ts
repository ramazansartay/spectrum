import 'dotenv/config';
import express from 'express';
import { createServer } from 'http';
import { setupStatic } from './static.js';

const app = express();
const httpServer = createServer(app);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

if (process.env.NODE_ENV === 'production') {
  setupStatic(app);
} else {
  console.log('Development mode');
}

const port = parseInt(process.env.PORT || '5000', 10);
const host = '0.0.0.0';

httpServer.listen(port, host, () => {
  console.log(`serving on port ${port}`);
});
