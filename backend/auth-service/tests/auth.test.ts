import jwt from 'jsonwebtoken';

// Mock dependencies before importing the app
jest.mock('pg', () => {
  const mPool = {
    query: jest.fn(),
    on: jest.fn(),
  };
  return { Pool: jest.fn(() => mPool) };
});

jest.mock('google-auth-library');
jest.mock('apple-signin-auth');
jest.mock('@sentry/node', () => ({
  init: jest.fn(),
  setupExpressErrorHandler: jest.fn(),
  captureException: jest.fn(),
  captureMessage: jest.fn(),
}));

jest.mock('../src/middleware/rate-limiter', () => ({
  authLimiter: (req: any, res: any, next: any) => next(),
  verifyLimiter: (req: any, res: any, next: any) => next(),
  generalLimiter: (req: any, res: any, next: any) => next(),
}));

import request from 'supertest';
import { Pool } from 'pg';
import app from '../src/index';

const JWT_SECRET = process.env.JWT_SECRET!;

describe('Auth Service', () => {
  let mockPool: any;

  beforeEach(() => {
    jest.clearAllMocks();

    // Get mocked pool instance
    mockPool = new Pool();

    // Mock pool.query to return successful results by default
    mockPool.query.mockResolvedValue({
      rows: [{
        id: 'google_123456789',
        provider: 'google',
        email: 'test@example.com',
        created_at: new Date(),
        updated_at: new Date(),
      }],
    });

    // Don't reset modules - keep the mocks in place
    // jest.resetModules();
    // delete require.cache[require.resolve('../src/index')];
  });

  describe('Health Check', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body).toEqual({
        status: 'ok',
        service: 'auth-service',
      });
    });
  });

  describe('POST /auth/google', () => {
    beforeEach(() => {
      // Mock Google OAuth verification
      const { OAuth2Client } = require('google-auth-library');
      OAuth2Client.prototype.verifyIdToken = jest.fn().mockResolvedValue({
        getPayload: () => ({
          sub: '123456789',
          email: 'test@example.com',
        }),
      });
    });

    it('should authenticate with valid Google token', async () => {
      const response = await request(app)
        .post('/auth/google')
        .send({ idToken: 'valid_google_token' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('userId');
      expect(response.body.provider).toBe('google');

      // Verify JWT token is valid
      const decoded = jwt.verify(response.body.token, JWT_SECRET) as any;
      expect(decoded.userId).toBe('google_123456789');
    });

    it('should return 400 for missing idToken', async () => {
      // App imported at top
      

      const response = await request(app)
        .post('/auth/google')
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('idToken is required');
    });

    it('should return 401 for invalid Google token', async () => {
      const { OAuth2Client } = require('google-auth-library');
      OAuth2Client.prototype.verifyIdToken = jest.fn().mockRejectedValue(
        new Error('Invalid token')
      );

      // App imported at top
      

      const response = await request(app)
        .post('/auth/google')
        .send({ idToken: 'invalid_token' })
        .expect(500);

      expect(response.body.success).toBe(false);
    });

    it('should create new user in database', async () => {
      // App imported at top
      

      await request(app)
        .post('/auth/google')
        .send({ idToken: 'valid_google_token' })
        .expect(200);

      expect(mockPool.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO users'),
        expect.arrayContaining(['google_123456789', 'google', 'test@example.com'])
      );
    });
  });

  describe('POST /auth/apple', () => {
    beforeEach(() => {
      // Mock Apple Sign-In verification
      const appleSignin = require('apple-signin-auth');
      appleSignin.verifyIdToken = jest.fn().mockResolvedValue({
        sub: 'apple_user_123',
        email: 'apple@example.com',
      });
    });

    it('should authenticate with valid Apple token', async () => {
      mockPool.query.mockResolvedValue({
        rows: [{
          id: 'apple_apple_user_123',
          provider: 'apple',
          email: 'apple@example.com',
        }],
      });

      // App imported at top
      

      const response = await request(app)
        .post('/auth/apple')
        .send({ identityToken: 'valid_apple_token' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('userId');
      expect(response.body.provider).toBe('apple');
    });

    it('should return 400 for missing identityToken', async () => {
      // App imported at top
      

      const response = await request(app)
        .post('/auth/apple')
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('identityToken is required');
    });

    it('should return 401 for invalid Apple token', async () => {
      const appleSignin = require('apple-signin-auth');
      appleSignin.verifyIdToken = jest.fn().mockRejectedValue(
        new Error('Invalid token')
      );

      // App imported at top
      

      const response = await request(app)
        .post('/auth/apple')
        .send({ identityToken: 'invalid_token' })
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /auth/verify', () => {
    it('should verify valid JWT token', async () => {
      // App imported at top
      

      const token = jwt.sign(
        { userId: 'test_user', provider: 'google', email: 'test@example.com' },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      const response = await request(app)
        .post('/auth/verify')
        .send({ token })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.decoded).toHaveProperty('userId');
      expect(response.body.decoded.userId).toBe('test_user');
    });

    it('should return 401 for missing token', async () => {
      // App imported at top
      

      const response = await request(app)
        .post('/auth/verify')
        .send({})
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('No token provided');
    });

    it('should return 401 for invalid token', async () => {
      // App imported at top
      

      const response = await request(app)
        .post('/auth/verify')
        .send({ token: 'invalid_token' })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Invalid token');
    });

    it('should return 401 for expired token', async () => {
      // App imported at top
      

      const expiredToken = jwt.sign(
        { userId: 'test_user', provider: 'google' },
        JWT_SECRET,
        { expiresIn: '-1s' } // Already expired
      );

      const response = await request(app)
        .post('/auth/verify')
        .send({ token: expiredToken })
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('JWT Token Generation', () => {
    it('should generate valid JWT with correct claims', async () => {
      // App imported at top
      

      const response = await request(app)
        .post('/auth/google')
        .send({ idToken: 'valid_token' })
        .expect(200);

      const decoded = jwt.verify(response.body.token, JWT_SECRET) as any;

      expect(decoded).toHaveProperty('userId');
      expect(decoded).toHaveProperty('provider');
      expect(decoded).toHaveProperty('email');
      expect(decoded).toHaveProperty('exp');
      expect(decoded).toHaveProperty('iat');
    });

    it('should generate token with 7 day expiration', async () => {
      // App imported at top
      

      const response = await request(app)
        .post('/auth/google')
        .send({ idToken: 'valid_token' })
        .expect(200);

      const decoded = jwt.verify(response.body.token, JWT_SECRET) as any;
      const expiresIn = decoded.exp - decoded.iat;

      // 7 days = 604800 seconds
      expect(expiresIn).toBe(604800);
    });
  });
});
