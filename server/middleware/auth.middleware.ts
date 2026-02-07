
import { Request, Response, NextFunction } from 'express';
import { lucia } from '../auth.js';
import { ApiError } from '../errors/ApiError.js';

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const sessionId = lucia.readSessionCookie(req.headers.cookie ?? "");
    if (!sessionId) {
        return next(new ApiError(401, 'Unauthorized'));
    }

    const { session, user } = await lucia.validateSession(sessionId);

    if (!session) {
        const sessionCookie = lucia.createBlankSessionCookie();
        res.cookie(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
        return next(new ApiError(401, 'Unauthorized'));
    }

    if (session.fresh) {
        const sessionCookie = lucia.createSessionCookie(session.id);
        res.cookie(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
    }

    res.locals.user = user;
    res.locals.session = session;
    return next();
};
