import express from 'express';

export const api = express.Router();

api.get('/users/me', (req, res) => {
    // res.locals.user populated by the Lucia middleware
    const user = res.locals.user;

    if (!user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    res.json({ user });
});
