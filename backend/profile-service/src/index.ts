import dotenv from 'dotenv';
// Load environment variables first
dotenv.config();

// Initialize Sentry before any other imports
import * as Sentry from '@sentry/node';

if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV || 'development',
    tracesSampleRate: 0.1, // 10% of transactions
  });
}

import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { Pool } from 'pg';
import { authMiddleware } from './middleware/auth';
import { validateProfile, validateProfileUpdate } from './middleware/validation';
import logger from './utils/logger';
import { generalLimiter, profileCreationLimiter, discoveryLimiter } from './middleware/rate-limiter';

const app = express();
const PORT = process.env.PORT || 3002;

// Log initialization
if (process.env.SENTRY_DSN) {
  logger.info('Sentry error tracking enabled', { environment: process.env.NODE_ENV || 'development' });
} else {
  logger.info('Sentry error tracking disabled (SENTRY_DSN not set)');
}

// In test environment, these are set in tests/setup.ts
if (!process.env.DATABASE_URL && process.env.NODE_ENV !== 'test') {
  logger.error('DATABASE_URL environment variable is required');
  process.exit(1);
}

if (!process.env.JWT_SECRET && process.env.NODE_ENV !== 'test') {
  logger.error('JWT_SECRET environment variable is required');
  process.exit(1);
}

// CORS origin from environment variable
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:19006';

// Security middleware
app.use(helmet());
app.use(cors({
  origin: CORS_ORIGIN,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10kb' }));

// Initialize PostgreSQL connection pool with proper configuration
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection cannot be established
  ssl: process.env.DATABASE_URL?.includes('railway')
    ? { rejectUnauthorized: true }
    : false,
});

// Database connection event handlers
pool.on('connect', (client) => {
  logger.info('New database connection established');
});

pool.on('acquire', (client) => {
  logger.debug('Database client acquired from pool');
});

pool.on('remove', (client) => {
  logger.debug('Database client removed from pool');
});

pool.on('error', (err, client) => {
  logger.error('Unexpected database connection error', {
    error: err.message,
    stack: err.stack
  });
});

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'profile-service' });
});

// Create profile - Extract userId from JWT token, not request body
app.post('/profile', authMiddleware, profileCreationLimiter, validateProfile, async (req: Request, res: Response) => {
  try {
    // Get userId from authenticated JWT token, not from request body
    const userId = req.user!.userId;
    const { name, age, bio, photos, interests } = req.body;

    const result = await pool.query(
      `INSERT INTO profiles (user_id, name, age, bio, photos, interests)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING user_id, name, age, bio, photos, interests, created_at, updated_at`,
      [userId, name, age, bio, photos || [], interests || []]
    );

    const profile = result.rows[0];

    res.json({
      success: true,
      profile: {
        userId: profile.user_id,
        name: profile.name,
        age: profile.age,
        bio: profile.bio,
        photos: profile.photos,
        interests: profile.interests
      }
    });
  } catch (error) {
    logger.error('Failed to save profile', { error, userId: req.user?.userId });
    res.status(500).json({ success: false, error: 'Failed to save profile' });
  }
});

// Get profile by userId - Only allow users to view their own profile
app.get('/profile/:userId', authMiddleware, generalLimiter, async (req: Request, res: Response) => {
  try {
    const requestedUserId = req.params.userId;
    const authenticatedUserId = req.user!.userId;

    // Authorization check: user can only view their own profile
    if (requestedUserId !== authenticatedUserId) {
      return res.status(403).json({
        success: false,
        error: 'Forbidden: Cannot access other users\' profiles'
      });
    }

    const result = await pool.query(
      `SELECT user_id, name, age, bio, photos, interests, created_at, updated_at
       FROM profiles
       WHERE user_id = $1`,
      [requestedUserId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Profile not found' });
    }

    const profile = result.rows[0];

    res.json({
      success: true,
      profile: {
        userId: profile.user_id,
        name: profile.name,
        age: profile.age,
        bio: profile.bio,
        photos: profile.photos,
        interests: profile.interests
      }
    });
  } catch (error) {
    logger.error('Failed to retrieve profile', { error, requestedUserId: req.params.userId });
    res.status(500).json({ success: false, error: 'Failed to retrieve profile' });
  }
});

// Update profile - Only allow users to update their own profile
app.put('/profile/:userId', authMiddleware, generalLimiter, validateProfileUpdate, async (req: Request, res: Response) => {
  try {
    const requestedUserId = req.params.userId;
    const authenticatedUserId = req.user!.userId;

    // Authorization check: user can only update their own profile
    if (requestedUserId !== authenticatedUserId) {
      return res.status(403).json({
        success: false,
        error: 'Forbidden: Cannot modify other users\' profiles'
      });
    }

    const { name, age, bio, photos, interests } = req.body;

    const result = await pool.query(
      `UPDATE profiles
       SET name = COALESCE($2, name),
           age = COALESCE($3, age),
           bio = COALESCE($4, bio),
           photos = COALESCE($5, photos),
           interests = COALESCE($6, interests),
           updated_at = CURRENT_TIMESTAMP
       WHERE user_id = $1
       RETURNING user_id, name, age, bio, photos, interests, created_at, updated_at`,
      [requestedUserId, name, age, bio, photos, interests]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Profile not found' });
    }

    const profile = result.rows[0];

    res.json({
      success: true,
      profile: {
        userId: profile.user_id,
        name: profile.name,
        age: profile.age,
        bio: profile.bio,
        photos: profile.photos,
        interests: profile.interests
      }
    });
  } catch (error) {
    logger.error('Failed to update profile', { error, requestedUserId: req.params.userId });
    res.status(500).json({ success: false, error: 'Failed to update profile' });
  }
});

// Delete profile - Only allow users to delete their own profile
app.delete('/profile/:userId', authMiddleware, generalLimiter, async (req: Request, res: Response) => {
  try {
    const requestedUserId = req.params.userId;
    const authenticatedUserId = req.user!.userId;

    // Authorization check: user can only delete their own profile
    if (requestedUserId !== authenticatedUserId) {
      return res.status(403).json({
        success: false,
        error: 'Forbidden: Cannot delete other users\' profiles'
      });
    }

    const result = await pool.query(
      `DELETE FROM profiles WHERE user_id = $1 RETURNING user_id`,
      [requestedUserId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Profile not found' });
    }

    res.json({ success: true, message: 'Profile deleted' });
  } catch (error) {
    logger.error('Failed to delete profile', { error, requestedUserId: req.params.userId });
    res.status(500).json({ success: false, error: 'Failed to delete profile' });
  }
});

// Get random profiles for discovery - Requires authentication
app.get('/profiles/discover', authMiddleware, discoveryLimiter, async (req: Request, res: Response) => {
  try {
    const authenticatedUserId = req.user!.userId;

    // Exclude the authenticated user's own profile from discovery
    const result = await pool.query(
      `SELECT user_id, name, age, bio, photos, interests
       FROM profiles
       WHERE user_id != $1
       ORDER BY RANDOM()
       LIMIT 10`,
      [authenticatedUserId]
    );

    const profiles = result.rows.map(profile => ({
      userId: profile.user_id,
      name: profile.name,
      age: profile.age,
      bio: profile.bio,
      photos: profile.photos,
      interests: profile.interests
    }));

    res.json({ success: true, profiles });
  } catch (error) {
    logger.error('Failed to retrieve profiles', { error });
    res.status(500).json({ success: false, error: 'Failed to retrieve profiles' });
  }
});

// Sentry error handler - must be after all routes but before generic error handler
if (process.env.SENTRY_DSN) {
  Sentry.setupExpressErrorHandler(app);
}

// Generic error handler (optional - for catching any remaining errors)
app.use((err: any, req: Request, res: Response, next: any) => {
  logger.error('Unhandled error', {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method
  });
  res.status(500).json({ success: false, error: 'Internal server error' });
});

// Only start server if not in test environment
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    logger.info(`Profile service started`, { port: PORT, environment: process.env.NODE_ENV || 'development' });
  });
}

// Export for testing
export default app;
