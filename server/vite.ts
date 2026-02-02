import { Express } from 'express';

export function setupVite(app: Express) {
  if (process.env.NODE_ENV === 'production') return;
  // In a real app, you would use Vite middleware here.
}
