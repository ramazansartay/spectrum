import express from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Эта функция будет заменена Vite во время сборки на путь к серверному бандлу
// @ts-ignore
import { render } from '../dist/server/entry-server.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const isTest = process.env.VITEST;

async function createServer() {
  const app = express();

  const resolve = (p: string) => path.resolve(__dirname, p);

  // Загружаем манифест для получения имен файлов ассетов
  const manifest = JSON.parse(
    fs.readFileSync(resolve('../dist/client/ssr-manifest.json'), 'utf-8'),
  );

  // Читаем шаблон HTML
  const template = fs.readFileSync(resolve('../dist/client/index.html'), 'utf-8');

  // Мидлвара для статики - обслуживаем всю папку dist/client
  app.use(express.static(resolve('../dist/client')));

  app.use('*', async (req, res) => {
    try {
      // Вызываем функцию рендеринга из нашего серверного бандла
      const { appHtml, preloadLinks } = await render(req.originalUrl, manifest);

      // Вставляем отрендеренное приложение и preload-ссылки в шаблон
      const html = template
        .replace(`<!--preload-links-->`, preloadLinks)
        .replace(`<!--ssr-outlet-->`, appHtml);

      res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
    } catch (e) {
      console.error(e);
      res.status(500).end('Internal Server Error');
    }
  });

  return { app };
}

if (!isTest) {
  createServer().then(({ app }) =>
    app.listen(3000, () => {
      console.log('Server listening on http://localhost:3000');
    }),
  );
}
