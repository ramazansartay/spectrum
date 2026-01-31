import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import App from './src/App';

export function render(url: string, manifest: any) {
  const appHtml = ReactDOMServer.renderToString(
    <React.StrictMode>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </React.StrictMode>
  );
  return { appHtml, preloadLinks: '' };
}
