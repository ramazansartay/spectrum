import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isProd = process.env.NODE_ENV === 'production';

async function createServer() {
  const app = express();

  // Определяем корень проекта. В production `__dirname` будет `dist-server`,
  // поэтому нам нужно подняться на один уровень вверх, чтобы достичь корня проекта.
  const root = isProd ? path.resolve(__dirname, '..') : process.cwd();
  const resolve = (p: string) => path.resolve(root, p);

  if (isProd) {
    // В production режиме раздаем статику из `dist-client`.
    // `express.static` автоматически найдет `index.html` и все ассеты.
    app.use(express.static(resolve('dist-client')));

    // Любой другой запрос должен также отдавать `index.html`, 
    // чтобы работал роутинг на стороне клиента.
    app.get('*', (req, res) => {
      res.sendFile(resolve('dist-client/index.html'));
    });

  } else {
    // В режиме разработки используем Vite Dev Server
    const vite = await (await import('vite')).createServer({
      root: resolve('client'),
      server: { middlewareMode: true },
      appType: 'custom',
    });
    app.use(vite.middlewares);

    // Обработчик для SSR в разработке
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
