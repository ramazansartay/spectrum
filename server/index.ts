import express from 'express';
import http from 'http';
import path from 'path';
import { init as initSocket } from './socket.js';
import { logger } from './logger.js';
import { api } from './routes.js';
import { auth, lucia } from './auth.js';
import config from './config.js';

const app = express();
const server = http.createServer(app);

initSocket(server);

app.use(express.json());

app.use(async (req, res, next) => {
	const sessionId = lucia.readSessionCookie(req.headers.cookie ?? "");
	if (!sessionId) {
		res.locals.user = null;
		res.locals.session = null;
		return next();
	}

	const { session, user } = await lucia.validateSession(sessionId);
	if (session && session.fresh) {
		res.appendHeader("Set-Cookie", lucia.createSessionCookie(session.id).serialize());
	}
	if (!session) {
		res.appendHeader("Set-Cookie", lucia.createBlankSessionCookie().serialize());
	}
	res.locals.session = session;
	res.locals.user = user;
	return next();
});

app.use(logger);
app.use('/api', auth);
app.use('/api', api);

const projectRoot = process.cwd();
const publicPath = path.join(projectRoot, 'dist/public');

app.use(express.static(publicPath));

app.get('*', (req, res) => {
  const indexPath = path.join(publicPath, 'index.html');
  res.sendFile(indexPath, (err) => {
      if (err) {
          console.error('Error sending file:', err);
          res.status(500).send(err);
      }
  });
});

const { port } = {
  port: process.env.PORT || 10000,
};

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
