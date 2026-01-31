import express from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// @ts-ignore
import { render } from '../dist-server/index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const isTest = process.env.VITEST;

async function createServer() {
  const app = express();

  const resolve = (p: string) => path.resolve(__dirname, p);

  const manifest = JSON.parse(
    fs.readFileSync(resolve('../dist-client/ssr-manifest.json'), 'utf-8'),
  );

  const template = fs.readFileSync(resolve('../dist-client/index.html'), 'utf-8');

  app.use(express.static(resolve('../dist-client')));

  app.use('*', async (req, res) => {
    try {
      const { appHtml, preloadLinks } = await render(req.originalUrl, manifest);

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
