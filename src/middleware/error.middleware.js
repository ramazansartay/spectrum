const ApiError = require('../errors/ApiError');

const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  // Handle specific errors from dependencies, e.g. database errors
  if (err.code === '23505') { // Example for PostgreSQL unique violation
    return res.status(409).json({ message: 'A resource with this value already exists.' });
  }

  // Default to 500 server error
  res.status(500).json({ message: 'An unexpected error occurred' });
};

module.exports = errorHandler;
