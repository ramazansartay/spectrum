
import { Lucia, TimeSpan } from 'lucia';
import { DrizzlePostgreSQLAdapter } from '@lucia-auth/adapter-drizzle';
import { pgTable, varchar, timestamp } from 'drizzle-orm/pg-core';
import { db } from './db'; // Предполагается, что db экспортируется из ./db
import { users } from '../shared/schema';
import { GitHub } from 'arctic';
import config from './config';
import express from 'express';
import bcrypt from 'bcryptjs';

const router = express.Router();

const adapter = new DrizzlePostgreSQLAdapter(db, pgTable('sessions', {
    id: varchar('id', { length: 255 }).primaryKey(),
    userId: varchar('user_id', { length: 255 }).notNull().references(() => users.id),
    expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'date' }).notNull(),
}), users);

export const lucia = new Lucia(adapter, {
    sessionCookie: {
        attributes: {
            secure: process.env.NODE_ENV === 'production',
        },
    },
    getUserAttributes: (attributes) => {
        return {
            id: attributes.id,
            email: attributes.email,
            name: attributes.name,
            avatarUrl: attributes.avatarUrl,
        };
    },
});

export const github = new GitHub(
    config.oauth.github.clientId,
    config.oauth.github.clientSecret
);

// Регистрация
router.post('/signup', async (req, res) => {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
        return res.status(400).json({ message: 'Email, password and name are required' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = generateId(15); // Замените на вашу функцию генерации ID

    try {
        await db.insert(users).values({
            id: userId,
            email,
            name,
            hashedPassword,
        });

        const session = await lucia.createSession(userId, {});
        res.appendHeader('Set-Cookie', lucia.createSessionCookie(session.id).serialize());
        return res.status(201).json({ message: 'User created' });
    } catch (error) {
        // Обработка ошибки, если пользователь уже существует
        return res.status(409).json({ message: 'User already exists' });
    }
});

// Вход
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    const existingUser = await db.query.users.findFirst({ where: (users, { eq }) => eq(users.email, email) });

    if (!existingUser || !existingUser.hashedPassword) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, existingUser.hashedPassword);

    if (!isValidPassword) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    const session = await lucia.createSession(existingUser.id, {});
    res.appendHeader('Set-Cookie', lucia.createSessionCookie(session.id).serialize());
    return res.status(200).json({ message: 'Logged in' });
});

// Выход
router.post('/logout', async (req, res) => {
    const sessionId = req.headers.cookie?.split('=')[1]; // Упрощенный парсинг cookie
    if (sessionId) {
        await lucia.invalidateSession(sessionId);
    }
    res.appendHeader('Set-Cookie', lucia.createBlankSessionCookie().serialize());
    return res.status(200).json({ message: 'Logged out' });
});

function generateId(length: number) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

export const auth = router;

declare module 'lucia' {
    interface Register {
        Lucia: typeof lucia;
        DatabaseUserAttributes: {
            id: string;
            email: string;
            name: string;
            avatarUrl: string | null;
        };
    }
}
