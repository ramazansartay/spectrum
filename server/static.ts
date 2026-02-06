import express, { Express } from 'express';
import { resolve } from 'path';

export function setupStatic(app: Express) {
  if (process.env.NODE_ENV !== 'production') return;

  const clientPath = resolve('dist/public');

  app.use(express.static(clientPath));

  app.get(/(.*)/, (req, res) => {
    res.sendFile(resolve(clientPath, 'index.html'));
  });
}
