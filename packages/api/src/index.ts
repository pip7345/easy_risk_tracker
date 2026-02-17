import express from 'express';
import compression from 'compression';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.js';
import projectRoutes from './routes/projects.js';
import aiRoutes from './routes/ai.js';
import { errorHandler } from './middleware/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';
const webDistPath = path.join(__dirname, '../../web/dist');
const docsDistPath = path.join(__dirname, '../../docs/build');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());

// CORS configuration
const allowedOrigins = process.env.CORS_ORIGINS?.split(',') || [
  'http://localhost:5173',
  'http://localhost:3000'
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

// Root route
// - In production, serve the built React SPA (same UX as localhost:5173)
// - In development, return API info JSON
app.get('/', (_req, res) => {
  if (isProduction) {
    res.sendFile(path.join(webDistPath, 'index.html'));
    return;
  }

  res.json({
    name: 'Crypto Bros Platform API',
    version: '2.0.0',
    status: 'running',
    endpoints: {
      health: '/api/health',
      info: '/api',
      auth: '/api/auth/*',
      projects: '/api/projects/*',
      ai: '/api/ai/*'
    },
    frontend: 'http://localhost:5173',
    docs: 'http://localhost:3001/docs/'
  });
});

// API info (always available)
app.get('/api', (_req, res) => {
  res.json({
    name: 'Crypto Bros Platform API',
    version: '2.0.0',
    status: 'running',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth/*',
      projects: '/api/projects/*',
      ai: '/api/ai/*'
    },
    frontend: isProduction ? 'Same origin' : 'http://localhost:5173',
    docs: isProduction ? '/docs' : 'http://localhost:3001/docs/'
  });
});

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/ai', aiRoutes);

// Legacy route redirects for old static HTML paths (before catch-all handlers)
app.get('/demo_full', (_req, res) => {
  res.redirect(301, process.env.NODE_ENV === 'development' 
    ? 'http://localhost:5173/demo-full' 
    : '/demo-full');
});

app.get('/demo_full/', (_req, res) => {
  res.redirect(301, process.env.NODE_ENV === 'development' 
    ? 'http://localhost:5173/demo-full' 
    : '/demo-full');
});

app.get('/demo', (_req, res) => {
  res.redirect(301, process.env.NODE_ENV === 'development' 
    ? 'http://localhost:5173/demo' 
    : '/demo');
});

app.get('/demo/', (_req, res) => {
  res.redirect(301, process.env.NODE_ENV === 'development' 
    ? 'http://localhost:5173/demo' 
    : '/demo');
});

if (!isProduction) {
  app.get('/login', (_req, res) => {
    res.redirect(301, 'http://localhost:5173/login');
  });
}

// Serve static frontend in production
if (isProduction) {
  // Serve docs at /docs
  app.use('/docs', express.static(docsDistPath));
  
  // Serve web app
  app.use(express.static(webDistPath));
  
  // SPA fallback - serve index.html for all non-API routes
  app.get('*', (_req, res) => {
    res.sendFile(path.join(webDistPath, 'index.html'));
  });
} else {
  // Development mode - provide helpful 404 message
  app.all('*', (_req, res) => {
    res.status(404).json({ 
      error: 'Not found',
      message: 'In development mode, frontend runs on http://localhost:5173',
      routes: {
        frontend: 'http://localhost:5173',
        docs: 'http://localhost:3001/docs/',
        api: 'http://localhost:3000/api/*'
      }
    });
  });
}

// Error handling
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 API Server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔐 CORS Origins: ${allowedOrigins.join(', ')}`);
});
