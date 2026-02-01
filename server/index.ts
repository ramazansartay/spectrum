import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const isProd = process.env.NODE_ENV === 'production';
const root = path.resolve(__dirname, '..');
const resolve = (p: string) => path.resolve(root, p);

async function createServer() {
  const app = express();

  if (isProd) {
    // В production-режиме ЯВНО указываем, что папка /assets
    // должна обслуживаться как статическая из папки dist-client/assets.
    // Это самая важная часть исправления.
    app.use('/assets', express.static(resolve('dist-client/assets')));
  } else {
    // В режиме разработки используем Vite Dev Server
    const vite = await (await import('vite')).createServer({
      server: { middlewareMode: true },
      appType: 'custom',
    });
    app.use(vite.middlewares);
  }

  // Обработчик рендеринга для всех остальных маршрутов.
  // Запросы к /assets сюда больше не попадут в production.
  app.use('*', async (req, res) => {
    try {
      const url = req.originalUrl;
      const template = isProd
        ? fs.readFileSync(resolve('dist-client/index.html'), 'utf-8')
        : fs.readFileSync(resolve('client/index.html'), 'utf-8');

      // В production больше не нужен сложный SSR-рендер,
      // так как проблема была в обслуживании статики.
      // Отдаем простой HTML, который сам загрузит React.
      const html = template;

      res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
    } catch (e: any) {
      console.log(e.stack);
      res.status(500).end(e.stack);
    }
  });

  return { app };
}

createServer().then(({ app }) =>
  app.listen(3000, () => {
    console.log('Server started at http://localhost:3000');
  })
);
