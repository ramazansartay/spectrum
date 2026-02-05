import express from 'express';

export const api = express.Router();

// TODO: Implement API routes
api.get('/', (req, res) => {
    res.json({ message: 'Hello from the API!' });
});
