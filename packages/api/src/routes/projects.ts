import { Router, Response } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth.js';
import { ApiErrorClass } from '../middleware/errorHandler.js';

const router = Router();

// Fetch project data from IIZR platform
router.post('/fetch', authenticate, async (req: AuthRequest, res: Response, next) => {
  try {
    const { projectId } = req.body;

    if (!projectId) {
      throw new ApiErrorClass('Project ID required', 400);
    }

    // Get stored IIZR credentials
    const iizrCreds = req.cookies.iizr_creds;
    if (!iizrCreds) {
      throw new ApiErrorClass('IIZR credentials not found', 401);
    }

    const { email, password } = JSON.parse(iizrCreds);

    // Fetch from IIZR API
    // This is the logic from project-fetch.js migrated to backend
    try {
      const loginResponse = await fetch('https://api.iizr.co/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (!loginResponse.ok) {
        throw new ApiErrorClass('IIZR authentication failed. Please check your credentials.', 401);
      }

      const loginData = await loginResponse.json() as { token: string };
      const { token } = loginData;

      // Fetch project data
      const projectResponse = await fetch(
        `https://api.iizr.co/api/projects/${projectId}`,
        {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!projectResponse.ok) {
        throw new ApiErrorClass('Failed to fetch project data from IIZR', 400);
      }

      const projectData = await projectResponse.json();

      res.json({
        success: true,
        project: projectData
      });
    } catch (error: any) {
      if (error.cause?.code === 'ENOTFOUND' || error.code === 'ENOTFOUND') {
        throw new ApiErrorClass('Unable to reach IIZR API (api.iizr.co). Please check your internet connection or use sample data.', 503);
      }
      throw error;
    }
  } catch (error) {
    next(error);
  }
});

// Use sample data (for demo purposes)
router.get('/sample', (_req, res) => {
  // Return sample project data
  res.json({
    success: true,
    project: {
      id: 'bd77a557-86fd-4974-8457-f46d2fd3cb67',
      name: 'Bellator',
      description: 'Sample project data',
      // Add more sample data as needed
    }
  });
});

export default router;
