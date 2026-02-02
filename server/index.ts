import 'dotenv/config';
import express from 'express';
import { createServer } from 'http';

const app = express();
const httpServer = createServer(app);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

if (process.env.NODE_ENV === 'production') {
  // In a real app, you would serve static files here.
} else {
  console.log('Development mode');
}

const port = parseInt(process.env.PORT || '5000', 10);
const host = '0.0.0.0';

httpServer.listen(port, host, () => {
  console.log(`serving on port ${port}`);
});
