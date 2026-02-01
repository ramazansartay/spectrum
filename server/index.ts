import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isProd = process.env.NODE_ENV === 'production';

async function createServer() {
  const app = express();

  const root = isProd ? path.resolve(__dirname, '..') : process.cwd();
  const resolve = (p: string) => path.resolve(root, p);

  if (isProd) {
    // 1. Раздаем статические ассеты (JS, CSS) из `dist-client`
    // `{ index: false }` предотвращает автоматическую отдачу `index.html`.
    app.use(express.static(resolve('dist-client'), { index: false }));

    // 2. Для всех остальных запросов выполняем SSR
    app.use('*', async (req, res) => {
        try {
            const url = req.originalUrl;

            // 2.1. Читаем ШАБЛОН HTML, созданный сборкой клиента
            const template = fs.readFileSync(resolve('dist-client/index.html'), 'utf-8');

            // 2.2. Загружаем рендер-функцию из СЕРВЕРНОЙ СБОРКИ приложения.
            // Этот файл будет создан на следующем шаге.
            const { render } = await import(path.resolve(__dirname, 'entry-server.js'));

            // 2.3. Рендерим приложение в HTML-строку
            const appHtml = await render(url);

            // 2.4. Вставляем HTML приложения в ШАБЛОН
            const html = template.replace(`<!--ssr-outlet-->`, appHtml);

            // 2.5. Отправляем финальный, полностью отрендеренный HTML
            res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
        } catch (e: any) {
            console.log(e.stack);
            res.status(500).end(e.stack);
        }
    });
  } else {
    // Режим разработки (остается без изменений)
    const vite = await (await import('vite')).createServer({
      root: resolve('client'),
      server: { middlewareMode: true },
      appType: 'custom',
    });
    app.use(vite.middlewares);

    app.use('*', async (req, res) => {
      try {
        const url = req.originalUrl;
        const template = await vite.transformIndexHtml(url, fs.readFileSync(resolve('client/index.html'), 'utf-8'));
        const render = (await vite.ssrLoadModule('/src/entry-server.tsx')).render;
        const appHtml = await render(url);
        const html = template.replace(`<!--ssr-outlet-->`, appHtml);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
      } catch (e: any) {
        vite.ssrFixStacktrace(e);
        console.log(e.stack);
        res.status(500).end(e.stack);
      }
    });
  }

  return { app };
}

createServer().then(({ app }) =>
  app.listen(3000, () => {
    console.log('Server started at http://localhost:3000');
  })
);
