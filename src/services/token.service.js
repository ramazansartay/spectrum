const jwt = require('jsonwebtoken');
const db = require('../config/db');

const generateTokens = (payload) => {
  const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION });
  const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRATION });
  return { accessToken, refreshToken };
};

const saveRefreshToken = async (userId, token) => {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  await db.query('INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)', [userId, token, expiresAt]);
};

const findRefreshToken = async (token) => {
  const { rows } = await db.query('SELECT * FROM refresh_tokens WHERE token = $1', [token]);
  return rows[0];
};

const removeRefreshToken = async (token) => {
  await db.query('DELETE FROM refresh_tokens WHERE token = $1', [token]);
};

module.exports = { generateTokens, saveRefreshToken, findRefreshToken, removeRefreshToken };
