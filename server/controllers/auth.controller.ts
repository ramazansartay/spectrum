
import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { lucia } from '../auth.js';
import { db } from '../db.js';
import { users } from '../../shared/schema.js';
import { eq } from 'drizzle-orm';
import { Argon2id } from 'oslo/password';
import { ApiError } from '../errors/ApiError.js';

export const register = async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new ApiError(400, `Validation error: ${errors.array()[0].msg}`));
    }

    const { email, password, username } = req.body;

    try {
        const existingUser = await db.select().from(users).where(eq(users.email, email));
        if (existingUser.length > 0) {
            return next(new ApiError(400, 'User with this email already exists'));
        }

        const hashedPassword = await new Argon2id().hash(password);

        const newUser = await db.insert(users).values({ email, passwordHash: hashedPassword, username }).returning({ id: users.id, email: users.email, username: users.username });

        const session = await lucia.createSession(newUser[0].id, {});
        const sessionCookie = lucia.createSessionCookie(session.id);

        res.cookie(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
        res.status(201).json({ user: newUser[0] });

    } catch (error) {
        next(error);
    }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new ApiError(400, `Validation error: ${errors.array()[0].msg}`));
    }

    const { email, password } = req.body;

    try {
        const [user] = await db.select().from(users).where(eq(users.email, email));

        if (!user) {
            return next(new ApiError(401, 'Invalid credentials'));
        }

        const validPassword = await new Argon2id().verify(user.passwordHash, password);
        if (!validPassword) {
            return next(new ApiError(401, 'Invalid credentials'));
        }

        const session = await lucia.createSession(user.id, {});
        const sessionCookie = lucia.createSessionCookie(session.id);

        res.cookie(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
        res.json({ message: "Logged in successfully" });

    } catch (error) {
        next(error);
    }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
    if (!res.locals.session) {
        return next(new ApiError(401, 'Unauthorized'));
    }
    await lucia.invalidateSession(res.locals.session.id);
    const sessionCookie = lucia.createBlankSessionCookie();
    res.cookie(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
    res.status(204).send();
};

export const refresh = async (req: Request, res: Response, next: NextFunction) => {
    // We are using session cookies, which are automatically refreshed.
    // This endpoint is kept for compatibility with the old API.
    if (!res.locals.session) {
        return next(new ApiError(401, 'Unauthorized'));
    }
    res.json({ message: "Session refreshed" });
};
