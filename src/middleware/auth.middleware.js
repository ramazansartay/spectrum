const jwt = require('jsonwebtoken');
const ApiError = require('../errors/ApiError');

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new ApiError(401, 'Authentication token is required'));
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded; // { id: ... }
    next();
  } catch (ex) {
    return next(new ApiError(401, 'Invalid authentication token'));
  }
};
