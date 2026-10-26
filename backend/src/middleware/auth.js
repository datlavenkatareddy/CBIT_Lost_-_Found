import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { AppError } from './errorHandler.js';

/**
 * Generate a signed JWT token (useful for testing and user sessions).
 */
export function signToken(payload, expiresIn = '7d') {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn });
}

/**
 * Optional authentication middleware.
 * If an Authorization Bearer token is provided, validates it
 * and attaches user info to req.user. If no token is provided, continues as guest.
 */
export function optionalAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      req.user = null;
      return next();
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      req.user = null;
      return next();
    }

    try {
      const decoded = jwt.verify(token, env.JWT_SECRET);
      req.user = {
        id: decoded.id || decoded.sub,
        email: decoded.email,
        role: decoded.role || 'authenticated'
      };
    } catch (err) {
      req.user = null;
    }

    next();
  } catch (err) {
    req.user = null;
    next();
  }
}

/**
 * Enforced authentication middleware.
 * Rejects requests without a valid Bearer token.
 */
export function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AppError('Authentication required. Missing Bearer token.', 401));
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return next(new AppError('Invalid Authorization header format.', 401));
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);
    req.user = {
      id: decoded.id || decoded.sub,
      email: decoded.email,
      role: decoded.role || 'authenticated'
    };
    next();
  } catch (err) {
    return next(new AppError('Invalid or expired authentication token.', 401));
  }
}
