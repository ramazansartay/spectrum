const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const path = require('path');
const ApiError = require('./errors/ApiError');

const authRouter = require('./api/routes/auth.routes');
const adsRouter = require('./api/routes/ads.routes');

const app = express();

// Middlewares
app.use(cors({ origin: process.env.CORS_ORIGIN }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Static files for uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));


// API Routes
app.get('/', (req, res) => res.send('Ads Platform API is running!'));
app.use('/api/auth', authRouter);
app.use('/api/ads', adsRouter);

// Centralized Error Handler
app.use((err, req, res, next) => {
  console.error(err);
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({ message: err.message });
  }
  return res.status(500).json({ message: 'Internal Server Error' });
});

module.exports = app;
