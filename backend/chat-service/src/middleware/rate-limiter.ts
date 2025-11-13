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
    prefix: 'rl:chat:general:',
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

// Match creation rate limiter (15 per 15 minutes per IP) - Already exists, keeping it
export const matchLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15,
  message: 'Too many match requests, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
  store: redisClient ? new RedisStore({
    client: redisClient,
    prefix: 'rl:chat:match:',
  }) : undefined,
  handler: (req, res) => {
    logger.warn('Match creation rate limit exceeded', {
      ip: req.ip,
      userId: (req as any).user?.userId,
      limiter: 'match'
    });
    res.status(429).json({
      success: false,
      error: 'Too many match requests, please try again later'
    });
  }
});

// Message sending rate limiter (100 per hour per user)
export const messageLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 100,
  message: 'Too many messages sent, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
  store: redisClient ? new RedisStore({
    client: redisClient,
    prefix: 'rl:chat:message:',
  }) : undefined,
  handler: (req, res) => {
    logger.warn('Message sending rate limit exceeded', {
      ip: req.ip,
      userId: (req as any).user?.userId,
      limiter: 'message'
    });
    res.status(429).json({
      success: false,
      error: 'Too many messages sent, please try again later'
    });
  }
});

// Report submission rate limiter (10 per day per user)
export const reportLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: 10,
  message: 'Too many reports submitted, please try again tomorrow',
  standardHeaders: true,
  legacyHeaders: false,
  store: redisClient ? new RedisStore({
    client: redisClient,
    prefix: 'rl:chat:report:',
  }) : undefined,
  handler: (req, res) => {
    logger.warn('Report submission rate limit exceeded', {
      ip: req.ip,
      userId: (req as any).user?.userId,
      limiter: 'report'
    });
    res.status(429).json({
      success: false,
      error: 'Too many reports submitted, please try again tomorrow'
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
    prefix: 'rl:chat:strict:',
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
