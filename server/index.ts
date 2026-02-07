
import express, { Express, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { api } from '../shared/routes.js';
import { ApiError } from './errors/ApiError.js';
import { lucia } from './auth.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(async (req: Request, res: Response, next: NextFunction) => {
    const sessionId = lucia.readSessionCookie(req.headers.cookie ?? "");
    if (!sessionId) {
        res.locals.user = null;
        res.locals.session = null;
        return next();
    }

    const { session, user } = await lucia.validateSession(sessionId);

    if (session && session.fresh) {
        const sessionCookie = lucia.createSessionCookie(session.id);
        res.cookie(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
    }
    if (!session) {
        const sessionCookie = lucia.createBlankSessionCookie();
        res.cookie(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
    }
    res.locals.session = session;
    res.locals.user = user;
    return next();
});

app.use('/api', api);
app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({ message: err.message });
    }
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
