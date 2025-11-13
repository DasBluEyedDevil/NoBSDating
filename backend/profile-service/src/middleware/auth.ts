import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import logger from '../utils/logger';

// Extend Express Request type to include user data
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        provider: string;
        email: string;
      };
    }
  }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized: No token provided'
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    if (!process.env.JWT_SECRET) {
      logger.error('JWT_SECRET is not configured');
      return res.status(500).json({
        success: false,
        error: 'Server configuration error'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as {
      userId: string;
      provider: string;
      email: string;
    };

    // Attach user data to request
    req.user = {
      userId: decoded.userId,
      provider: decoded.provider,
      email: decoded.email
    };

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized: Invalid token'
      });
    }
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized: Token expired'
      });
    }

    logger.error('Auth middleware error', { error });
    return res.status(500).json({
      success: false,
      error: 'Authentication failed'
    });
  }
};
