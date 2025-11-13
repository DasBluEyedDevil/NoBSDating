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

// Valid report reasons enum
const VALID_REPORT_REASONS = [
  'inappropriate_content',
  'harassment',
  'spam',
  'fake_profile',
  'underage',
  'violence_threats',
  'hate_speech',
  'scam',
  'other'
];

// Message validation rules
export const validateMessage = [
  // Message text: 1-500 characters, required
  body('text')
    .notEmpty()
    .withMessage('Message text is required')
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage('Message text must be between 1 and 500 characters'),

  // Match ID: String, not empty
  body('matchId')
    .notEmpty()
    .withMessage('matchId is required')
    .trim()
    .isString()
    .withMessage('matchId must be a string'),

  // Sender ID: String, not empty
  body('senderId')
    .notEmpty()
    .withMessage('senderId is required')
    .trim()
    .isString()
    .withMessage('senderId must be a string'),

  handleValidationErrors
];

// Match creation validation rules
export const validateMatch = [
  // User ID 1: String, not empty
  body('userId1')
    .notEmpty()
    .withMessage('userId1 is required')
    .trim()
    .isString()
    .withMessage('userId1 must be a string'),

  // User ID 2: String, not empty
  body('userId2')
    .notEmpty()
    .withMessage('userId2 is required')
    .trim()
    .isString()
    .withMessage('userId2 must be a string'),

  // Additional validation: users cannot match with themselves
  body('userId2').custom((value, { req }) => {
    if (value === req.body.userId1) {
      throw new Error('Users cannot match with themselves');
    }
    return true;
  }),

  handleValidationErrors
];

// Report validation rules
export const validateReport = [
  // Reporter ID: String, not empty
  body('reporterId')
    .notEmpty()
    .withMessage('reporterId is required')
    .trim()
    .isString()
    .withMessage('reporterId must be a string'),

  // Reported User ID: String, not empty
  body('reportedUserId')
    .notEmpty()
    .withMessage('reportedUserId is required')
    .trim()
    .isString()
    .withMessage('reportedUserId must be a string'),

  // Reason: Enum of valid reasons
  body('reason')
    .notEmpty()
    .withMessage('Reason is required')
    .trim()
    .isIn(VALID_REPORT_REASONS)
    .withMessage(`Reason must be one of: ${VALID_REPORT_REASONS.join(', ')}`),

  // Details: Optional, 0-1000 characters
  body('details')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Details must be maximum 1000 characters'),

  // Additional validation: cannot report yourself
  body('reportedUserId').custom((value, { req }) => {
    if (value === req.body.reporterId) {
      throw new Error('Cannot report yourself');
    }
    return true;
  }),

  handleValidationErrors
];

// Block user validation rules
export const validateBlock = [
  // User ID: String, not empty
  body('userId')
    .notEmpty()
    .withMessage('userId is required')
    .trim()
    .isString()
    .withMessage('userId must be a string'),

  // Blocked User ID: String, not empty
  body('blockedUserId')
    .notEmpty()
    .withMessage('blockedUserId is required')
    .trim()
    .isString()
    .withMessage('blockedUserId must be a string'),

  // Reason: Optional string
  body('reason')
    .optional()
    .trim()
    .isString()
    .withMessage('Reason must be a string')
    .isLength({ max: 500 })
    .withMessage('Reason must be maximum 500 characters'),

  // Additional validation: cannot block yourself
  body('blockedUserId').custom((value, { req }) => {
    if (value === req.body.userId) {
      throw new Error('Cannot block yourself');
    }
    return true;
  }),

  handleValidationErrors
];
