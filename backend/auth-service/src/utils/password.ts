import bcrypt from 'bcrypt';

const SALT_ROUNDS = 12;

// Password requirements
const MIN_LENGTH = 8;
const HAS_LETTER = /[a-zA-Z]/;
const HAS_NUMBER = /[0-9]/;

export interface PasswordValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Validate password meets requirements
 */
export function validatePassword(password: string): PasswordValidationResult {
  const errors: string[] = [];

  if (password.length < MIN_LENGTH) {
    errors.push(`Password must be at least ${MIN_LENGTH} characters`);
  }

  if (!HAS_LETTER.test(password)) {
    errors.push('Password must contain at least one letter');
  }

  if (!HAS_NUMBER.test(password)) {
    errors.push('Password must contain at least one number');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
