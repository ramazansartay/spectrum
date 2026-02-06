const { body } = require('express-validator');

const validateRegistration = [
  body('email', 'Invalid email format').isEmail(),
  body('password', 'Password must be at least 6 characters long').isLength({ min: 6 }),
];

const validateLogin = [
  body('email', 'Email is required').notEmpty(),
  body('password', 'Password is required').notEmpty(),
];

const validateAd = [
    body('title', 'Title is required').notEmpty(),
    body('description', 'Description is required').notEmpty(),
    body('price', 'Price must be a valid number').isFloat({ gt: 0 }),
    body('category', 'Category is required').notEmpty(),
];

module.exports = { validateRegistration, validateLogin, validateAd };
