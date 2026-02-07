# Crypto Bros Monorepo - Deployment Guide

## 📦 Build Process

The monorepo uses Turborepo to orchestrate builds across all packages:

```bash
npm install
npm run build
```

This will:
1. Build `packages/shared` (types and utilities)
2. Build `packages/api` (Express backend)
3. Build `packages/web` (React frontend)
4. Build `packages/docs` (Docusaurus documentation)

## 🚀 Deployment Options

### Option 1: Render (Recommended)

The project includes a `render.yaml` configuration for easy deployment:

1. **Connect Repository**: Link your GitHub repo to Render
2. **Environment Variables**: Set in Render dashboard:
   - `JWT_SECRET` (auto-generated)
   - `OPENAI_API_KEY` (optional)
   - `IIZR_EMAIL` (optional)
   - `IIZR_PASSWORD` (optional)
3. **Deploy**: Render will automatically build and deploy

The API will serve both the API endpoints and static frontend files.

### Option 2: Vercel

Deploy frontend and backend separately:

**Frontend (packages/web)**:
```bash
cd packages/web
vercel
```

**Backend (packages/api)**:
```bash
cd packages/api
vercel
```

Set environment variable `VITE_API_URL` in frontend to point to backend URL.

### Option 3: Railway

Similar to Render:
1. Connect GitHub repository
2. Railway will detect Node.js project
3. Set environment variables
4. Deploy

### Option 4: Traditional VPS (PM2)

Use the included `ecosystem.config.js`:

```bash
npm install
npm run build
pm2 start ecosystem.config.js
```

## 🌐 Production Serving

In production, the API server can serve both API routes and static frontend:

```javascript
// Add to packages/api/src/index.ts
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import express from 'express';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Serve static frontend
app.use(express.static(join(__dirname, '../../web/dist')));

// Serve docs at /docs
app.use('/docs', express.static(join(__dirname, '../../docs/build')));

// Fallback for SPA routing
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, '../../web/dist/index.html'));
});
```

## 🔧 Environment Variables

Required for production:
- `NODE_ENV=production`
- `PORT=3000`
- `JWT_SECRET` (generate with: `openssl rand -base64 32`)

Optional:
- `OPENAI_API_KEY` - For AI queries (can be provided by users)
- `IIZR_EMAIL` - Auto-fill login form
- `IIZR_PASSWORD` - Auto-fill login form
- `CORS_ORIGINS` - Comma-separated allowed origins

## 📊 Monitoring

Add monitoring for production:

```bash
npm install @sentry/node @sentry/react
```

## 🔄 CI/CD

GitHub Actions example:

```yaml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - run: npm test
      # Deploy steps here
```

## 🐳 Docker (Optional)

Dockerfile coming soon for containerized deployment.
