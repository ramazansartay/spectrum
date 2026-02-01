import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const isTest = process.env.VITEST;
const isProd = process.env.NODE_ENV === 'production';

async function createServer() {
  const app = express();

  // 1. Определяем корневую директорию проекта.
  // В production `__dirname` это `.../dist-server`, поэтому корень - это `../`
  // В dev `__dirname` это `.../server`, поэтому корень - это `../`
  const root = path.resolve(__dirname, '..');

  // 2. Создаем резолвер для путей от корня проекта.
  const resolve = (p: string) => path.resolve(root, p);

  let vite: any;
  if (!isProd) {
    // В режиме разработки используем Vite Dev Server
    vite = await (await import('vite')).createServer({
      server: { middlewareMode: true },
      appType: 'custom',
    });
    app.use(vite.middlewares);
  } else {
    // В режиме production раздаем статику из `dist-client`
    app.use(express.static(resolve('dist-client')));
  }

  // 3. Обработчик рендеринга для всех остальных маршрутов
  app.use('*', async (req, res) => {
    try {
      const url = req.originalUrl;

      let template, render;

      if (!isProd) {
        // DEV: Обрабатываем `index.html` через Vite
        template = fs.readFileSync(resolve('client/index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        // DEV: Загружаем серверный модуль через Vite
        render = (await vite.ssrLoadModule('/client/entry-server.tsx')).render;
      } else {
        // PROD: Читаем `index.html` из `dist-client`
        template = fs.readFileSync(resolve('dist-client/index.html'), 'utf-8');
        // PROD: Импортируем скомпилированный серверный модуль
        // @ts-ignore
        render = (await import(resolve('dist-server/index.js'))).render;
      }

      // Рендерим HTML приложения
      const appHtml = await render(url);

      const html = template.replace(`<!--ssr-outlet-->`, appHtml);

      res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
    } catch (e: any) {
      if (vite) vite.ssrFixStacktrace(e);
      console.log(e.stack);
      res.status(500).end(e.stack);
    }
  });

  return { app };
}

if (!isTest) {
  createServer().then(({ app }) =>
    app.listen(3000, () => {
      console.log('Server started at http://localhost:3000');
    })
  );
}
