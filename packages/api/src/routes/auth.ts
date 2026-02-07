import { Router, Request, Response } from 'express';
import { generateToken } from '../middleware/auth.js';
import { ApiErrorClass } from '../middleware/errorHandler.js';

const router = Router();

// Login endpoint
router.post('/login', async (req: Request, res: Response, next) => {
  try {
    const { email, password, projectId } = req.body;

    if (!email || !password) {
      throw new ApiErrorClass('Email and password required', 400);
    }

    // Store credentials in session for IIZR API calls
    // In production, you'd validate these against a database
    // For now, we'll create a token with the provided credentials
    const userId = Buffer.from(email).toString('base64').substring(0, 16);
    const token = generateToken(userId, email);

    // Set httpOnly cookie
    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    // Store IIZR credentials in separate cookie (encrypted in production!)
    res.cookie('iizr_creds', JSON.stringify({ email, password }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({
      success: true,
      user: { id: userId, email },
      projectId
    });
  } catch (error) {
    next(error);
  }
});

// Logout endpoint
router.post('/logout', (req: Request, res: Response) => {
  res.clearCookie('auth_token');
  res.clearCookie('iizr_creds');
  res.json({ success: true });
});

// Check auth status
router.get('/status', (req: Request, res: Response) => {
  const token = req.cookies.auth_token;
  
  if (!token) {
    return res.json({ authenticated: false });
  }

  res.json({ authenticated: true });
});

export default router;
