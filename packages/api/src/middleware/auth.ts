import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ApiErrorClass } from './errorHandler.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export interface AuthRequest extends Request {
  userId?: string;
  userEmail?: string;
}

export function authenticate(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  try {
    const token = req.cookies.auth_token;

    if (!token) {
      throw new ApiErrorClass('Authentication required', 401);
    }

    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: string;
      email: string;
    };

    (req as AuthRequest).userId = decoded.userId;
    (req as AuthRequest).userEmail = decoded.email;

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new ApiErrorClass('Invalid token', 401));
    } else {
      next(error);
    }
  }
}

export function generateToken(userId: string, email: string): string {
  return jwt.sign({ userId, email }, JWT_SECRET, { expiresIn: '7d' });
}
