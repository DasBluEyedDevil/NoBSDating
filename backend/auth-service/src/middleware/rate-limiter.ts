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
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  store: redisClient ? new RedisStore({
    client: redisClient,
    prefix: 'rl:general:',
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

// Authentication rate limiter (10 requests per 15 minutes per IP)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: 'Too many authentication attempts, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
  store: redisClient ? new RedisStore({
    client: redisClient,
    prefix: 'rl:auth:',
  }) : undefined,
  handler: (req, res) => {
    logger.warn('Auth rate limit exceeded', {
      ip: req.ip,
      path: req.path,
      limiter: 'auth'
    });
    res.status(429).json({
      success: false,
      error: 'Too many authentication attempts, please try again later'
    });
  }
});

// Token verification rate limiter (100 requests per 15 minutes per IP)
export const verifyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: 'Too many verification requests, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
  store: redisClient ? new RedisStore({
    client: redisClient,
    prefix: 'rl:verify:',
  }) : undefined,
  handler: (req, res) => {
    logger.warn('Verify rate limit exceeded', {
      ip: req.ip,
      path: req.path,
      limiter: 'verify'
    });
    res.status(429).json({
      success: false,
      error: 'Too many verification requests, please try again later'
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
    prefix: 'rl:strict:',
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
