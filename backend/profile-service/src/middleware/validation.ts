import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

// Middleware to handle validation errors
export const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map(err => ({
        field: err.type === 'field' ? err.path : 'unknown',
        message: err.msg
      }))
    });
  }
  next();
};

// Profile validation rules (userId comes from JWT, not body)
export const validateProfile = [
  // Name validation: 2-100 characters, alphanumeric + spaces
  body('name')
    .notEmpty()
    .withMessage('Name is required')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters')
    .matches(/^[a-zA-Z0-9\s]+$/)
    .withMessage('Name can only contain letters, numbers, and spaces'),

  // Age validation: CRITICAL - Must be 18 or older
  body('age')
    .notEmpty()
    .withMessage('Age is required')
    .isInt({ min: 18, max: 120 })
    .withMessage('Age must be at least 18 and no more than 120'),

  // Bio validation: Optional, max 500 characters
  body('bio')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Bio must be maximum 500 characters'),

  // Photos validation: Array, max 6 items, valid URLs
  body('photos')
    .optional()
    .isArray({ max: 6 })
    .withMessage('Photos must be an array with maximum 6 items'),

  body('photos.*')
    .optional()
    .isURL({ protocols: ['http', 'https'], require_protocol: true })
    .withMessage('Each photo must be a valid URL'),

  // Interests validation: Array of strings, max 10 items, each max 50 chars
  body('interests')
    .optional()
    .isArray({ max: 10 })
    .withMessage('Interests must be an array with maximum 10 items'),

  body('interests.*')
    .optional()
    .trim()
    .isString()
    .withMessage('Each interest must be a string')
    .isLength({ min: 1, max: 50 })
    .withMessage('Each interest must be between 1 and 50 characters'),

  handleValidationErrors
];

// Profile update validation rules (fields are optional)
export const validateProfileUpdate = [
  // Name validation: 2-100 characters, alphanumeric + spaces (optional)
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters')
    .matches(/^[a-zA-Z0-9\s]+$/)
    .withMessage('Name can only contain letters, numbers, and spaces'),

  // Age validation: CRITICAL - Must be 18 or older (optional)
  body('age')
    .optional()
    .isInt({ min: 18, max: 120 })
    .withMessage('Age must be at least 18 and no more than 120'),

  // Bio validation: Optional, max 500 characters
  body('bio')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Bio must be maximum 500 characters'),

  // Photos validation: Array, max 6 items, valid URLs
  body('photos')
    .optional()
    .isArray({ max: 6 })
    .withMessage('Photos must be an array with maximum 6 items'),

  body('photos.*')
    .optional()
    .isURL({ protocols: ['http', 'https'], require_protocol: true })
    .withMessage('Each photo must be a valid URL'),

  // Interests validation: Array of strings, max 10 items, each max 50 chars
  body('interests')
    .optional()
    .isArray({ max: 10 })
    .withMessage('Interests must be an array with maximum 10 items'),

  body('interests.*')
    .optional()
    .trim()
    .isString()
    .withMessage('Each interest must be a string')
    .isLength({ min: 1, max: 50 })
    .withMessage('Each interest must be between 1 and 50 characters'),

  handleValidationErrors
];
