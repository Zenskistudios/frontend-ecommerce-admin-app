const { body, validationResult } = require('express-validator');

/**
 * Shared product validation rules (matches Task 1 + frontend).
 * - name required
 * - price > 0
 * - stockQuantity >= 0
 * - description required
 */
const productValidationRules = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Product name is required.')
    .isLength({ max: 200 })
    .withMessage('Product name must be at most 200 characters.'),

  body('price')
    .notEmpty()
    .withMessage('Price is required.')
    .isFloat({ gt: 0 })
    .withMessage('Price must be greater than zero.')
    .toFloat(),

  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required.')
    .isLength({ max: 2000 })
    .withMessage('Description must be at most 2000 characters.'),

  body('stockQuantity')
    .notEmpty()
    .withMessage('Stock quantity is required.')
    .isInt({ min: 0 })
    .withMessage('Stock quantity cannot be negative.')
    .toInt(),

  body('category')
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isLength({ max: 100 })
    .withMessage('Category must be at most 100 characters.'),

  body('image')
    .optional({ nullable: true, checkFalsy: true })
    .trim(),
];

const loginValidationRules = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required.')
    .isEmail()
    .withMessage('Please provide a valid email address.')
    .normalizeEmail(),

  body('password')
    .notEmpty()
    .withMessage('Password is required.')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters.'),
];

/**
 * Middleware that runs after the rules and returns 400 if any failed.
 */
function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed.',
      errors: errors.array().map((e) => ({
        field: e.path,
        message: e.msg,
      })),
    });
  }
  next();
}

module.exports = {
  productValidationRules,
  loginValidationRules,
  validate,
};
