import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import { createClient } from 'redis';
import logger from '../utils/logger';

// Optional Redis client (falls back to memory if not configured)
let redisClient: ReturnType<typeof createClient> | undefined;

if (process.env.REDIS_URL) {
  redisClient = createClient({ url: process.env.REDIS_URL });

  redisClient.on('error', (err) => {
    logger.error('Redis client error', { error: err.message });
  });

  redisClient.on('connect', () => {
    logger.info('Redis client connected for rate limiting');
  });

  redisClient.connect().catch((err) => {
    logger.warn('Failed to connect to Redis, falling back to memory store', { error: err.message });
    redisClient = undefined;
  });
} else {
  logger.info('REDIS_URL not set, using memory store for rate limiting (not suitable for production)');
}

// General API rate limiter (100 requests per 15 minutes per IP)
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: 'Too many requests from this IP, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
  store: redisClient ? new RedisStore({
    client: redisClient,
    prefix: 'rl:profile:general:',
  }) : undefined,
  handler: (req, res) => {
    logger.warn('Rate limit exceeded', {
      ip: req.ip,
      path: req.path,
      limiter: 'general'
    });
    res.status(429).json({
      success: false,
      error: 'Too many requests from this IP, please try again later'
    });
  }
});

// Profile creation rate limiter (5 per day per user)
// Note: This is per IP, ideally should be per user ID using keyGenerator
export const profileCreationLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: 5,
  message: 'Too many profile creation attempts, please try again tomorrow',
  standardHeaders: true,
  legacyHeaders: false,
  store: redisClient ? new RedisStore({
    client: redisClient,
    prefix: 'rl:profile:create:',
  }) : undefined,
  handler: (req, res) => {
    logger.warn('Profile creation rate limit exceeded', {
      ip: req.ip,
      userId: (req as any).user?.userId,
      limiter: 'profileCreation'
    });
    res.status(429).json({
      success: false,
      error: 'Too many profile creation attempts, please try again tomorrow'
    });
  }
});

// Discovery rate limiter (200 requests per 15 minutes per user)
export const discoveryLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  message: 'Too many discovery requests, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
  store: redisClient ? new RedisStore({
    client: redisClient,
    prefix: 'rl:profile:discover:',
  }) : undefined,
  handler: (req, res) => {
    logger.warn('Discovery rate limit exceeded', {
      ip: req.ip,
      userId: (req as any).user?.userId,
      limiter: 'discovery'
    });
    res.status(429).json({
      success: false,
      error: 'Too many discovery requests, please try again later'
    });
  }
});

// Strict rate limiter for sensitive operations (5 requests per 15 minutes per IP)
export const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: 'Too many requests for this sensitive operation, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
  store: redisClient ? new RedisStore({
    client: redisClient,
    prefix: 'rl:profile:strict:',
  }) : undefined,
  handler: (req, res) => {
    logger.warn('Strict rate limit exceeded', {
      ip: req.ip,
      path: req.path,
      limiter: 'strict'
    });
    res.status(429).json({
      success: false,
      error: 'Too many requests for this sensitive operation, please try again later'
    });
  }
});

// Export redis client for graceful shutdown
export { redisClient };
