const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const db = require('../../config/db');
const ApiError = require('../../errors/ApiError');
const tokenService = require('../../services/token.service');

const register = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new ApiError(400, `Validation error: ${errors.array()[0].msg}`));
  }

  const { email, password } = req.body;

  try {
    const userExists = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
      return next(new ApiError(400, 'User with this email already exists'));
    }

    const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_SALT_ROUNDS, 10));
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await db.query(
      'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email',
      [email, hashedPassword]
    );

    res.status(201).json({ user: newUser.rows[0] });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new ApiError(400, `Validation error: ${errors.array()[0].msg}`));
    }

    const { email, password } = req.body;

    try {
        const { rows } = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = rows[0];

        if (!user) {
            return next(new ApiError(401, 'Invalid credentials'));
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return next(new ApiError(401, 'Invalid credentials'));
        }

        const tokens = tokenService.generateTokens({ id: user.id });
        await tokenService.saveRefreshToken(user.id, tokens.refreshToken);

        res.cookie('refreshToken', tokens.refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
        res.json({ accessToken: tokens.accessToken });

    } catch (error) {
        next(error);
    }
};

const refresh = async (req, res, next) => {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
        return next(new ApiError(401, 'Refresh token not found'));
    }

    try {
        const existingToken = await tokenService.findRefreshToken(refreshToken);
        if (!existingToken) {
            return next(new ApiError(403, 'Invalid refresh token'));
        }

        const userData = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

        const tokens = tokenService.generateTokens({ id: userData.id });
        await tokenService.removeRefreshToken(refreshToken); // Or update existing one
        await tokenService.saveRefreshToken(userData.id, tokens.refreshToken);

        res.cookie('refreshToken', tokens.refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
        res.json({ accessToken: tokens.accessToken });

    } catch (error) {
        next(new ApiError(403, 'Invalid refresh token'));
    }
};

const logout = async (req, res, next) => {
    const { refreshToken } = req.cookies;
    if (refreshToken) {
        await tokenService.removeRefreshToken(refreshToken);
    }
    res.clearCookie('refreshToken');
    res.status(204).send();
};

module.exports = { register, login, refresh, logout };
