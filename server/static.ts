import { Express } from 'express';
import { resolve } from 'path';

export function setupStatic(app: Express) {
  if (process.env.NODE_ENV !== 'production') return;

  const clientPath = resolve('client');

  app.use(express.static(clientPath));

  app.get('*_*, (req, res) => {
    res.sendFile(resolve(clientPath, 'index.html'));
  });
}
