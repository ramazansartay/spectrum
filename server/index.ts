import express from 'express';
import http from 'http';
import path from 'path';
import { init as initSocket } from './socket.js';
import { logger } from './logger.js';
import { api } from './routes.js';
import { auth, lucia } from './auth.js'; // Импортируем lucia
import config from './config.js';
// import './types'; // Импорт удален, так как он вызывает ошибку выполнения

const app = express();
const server = http.createServer(app);

initSocket(server);

app.use(express.json());

// Middleware для сессий Lucia
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

// Correctly serve static files from the ../dist/public folder
const publicPath = path.resolve(__dirname, '../public');
app.use(express.static(publicPath));

// Return index.html for all other requests
app.get('*', (req, res) => {
  res.sendFile(path.resolve(publicPath, 'index.html'));
});

const { port } = {
  port: process.env.PORT || 3000,
};

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
