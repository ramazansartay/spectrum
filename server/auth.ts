// @ts-nocheck
import { Lucia } from 'lucia';
import { DrizzlePostgreSQLAdapter } from '@lucia-auth/adapter-drizzle';
import { db } from './db';
import { users, sessions } from '../shared/schema';
import { GitHub } from 'arctic';
import config from './config';
import express from 'express';
import bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';
import { eq } from 'drizzle-orm';

const router = express.Router();

const adapter = new DrizzlePostgreSQLAdapter(db as any, sessions, users);

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

// --- НОВЫЕ МАРШРУТЫ ДЛЯ GITHUB ---

router.get('/github', async (req, res) => {
    const state = randomBytes(8).toString('hex');
    const url = await github.createAuthorizationURL(state, {
        scopes: ['user:email'],
    });
    res.cookie('github_oauth_state', state, {
        path: '/',
        httpOnly: true,
        maxAge: 60 * 10, // 10 минут
    });
    res.redirect(url.toString());
});

router.get('/github/callback', async (req, res) => {
    const code = req.query.code as string;
    const state = req.query.state as string;
    const storedState = req.cookies.github_oauth_state;

    if (!code || !state || !storedState || state !== storedState) {
        return res.status(400).json({ message: 'Invalid state or code' });
    }

    try {
        const tokens = await github.validateAuthorizationCode(code);
        const githubUserResponse = await fetch('https://api.github.com/user', {
            headers: {
                Authorization: `Bearer ${tokens.accessToken}`,
                'User-Agent': 'spectrum-app',
            },
        });
        const githubUser = await githubUserResponse.json();

        const existingUser = await db.query.users.findFirst({
            where: eq(users.githubId, githubUser.id),
        });

        if (existingUser) {
            const session = await lucia.createSession(existingUser.id, {});
            res.appendHeader('Set-Cookie', lucia.createSessionCookie(session.id).serialize());
            return res.redirect('/profile');
        }

        const userId = randomBytes(8).toString('hex');
        await db.insert(users).values({
            id: userId,
            githubId: githubUser.id,
            name: githubUser.name,
            email: githubUser.email,
            avatarUrl: githubUser.avatar_url,
        });

        const session = await lucia.createSession(userId, {});
        res.appendHeader('Set-Cookie', lucia.createSessionCookie(session.id).serialize());
        return res.redirect('/profile');

    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: 'Something went wrong' });
    }
});


// --- СУЩЕСТВУЮЩИЕ МАРШРУТЫ ---

router.post('/signup', async (req, res) => {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
        return res.status(400).json({ message: 'Email, password and name are required' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = randomBytes(8).toString('hex');

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
        return res.status(409).json({ message: 'User already exists' });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    const existingUser = await db.query.users.findFirst({ where: eq(users.email, email) });

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

router.post('/logout', async (req, res) => {
    if (res.locals.session) {
        await lucia.invalidateSession(res.locals.session.id);
    }
    res.appendHeader('Set-Cookie', lucia.createBlankSessionCookie().serialize());
    return res.status(200).json({ message: 'Logged out' });
});


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
