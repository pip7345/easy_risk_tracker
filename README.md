# Crypto Bros Platform - Monorepo

Modern full-stack platform for crypto project risk assessment, featuring Easy Risk Tracker documentation and interactive demos.

## 🏗️ Architecture

**Monorepo Structure** powered by Turborepo:

```
deploy/
├── packages/
│   ├── web/          # React SPA (Vite + React Router + Tailwind)
│   ├── api/          # Express REST API (TypeScript)
│   ├── shared/       # Shared types and utilities
│   └── docs/         # Docusaurus documentation
├── package.json      # Root workspace config
└── turbo.json        # Turborepo pipeline config
```

## 🚀 Quick Start

### Prerequisites
- Node.js ≥18.0.0
- npm ≥9.0.0

### Installation

```bash
# Install all dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your credentials
```

### Development

```bash
# Run all packages in dev mode (parallel)
npm run dev

# Access points:
# - Frontend: http://localhost:5173
# - API: http://localhost:3000
# - Docs: http://localhost:3001
```

### Production Build

```bash
# Build all packages
npm run build

# Start production server
npm start
```

## 📦 Packages

### `packages/web`
React single-page application with:
- **Vite** - Fast build tool and dev server
- **React Router** - Client-side routing
- **TanStack Query** - Data fetching and caching
- **Tailwind CSS** - Utility-first styling
- **TypeScript** - Type safety

### `packages/api`
Express REST API with:
- **TypeScript** - Full type safety
- **JWT Authentication** - Secure auth with httpOnly cookies
- **CORS** - Configured for local and production
- **Routes**: `/api/auth`, `/api/projects`, `/api/ai`

### `packages/shared`
Shared code between web and api:
- TypeScript types and interfaces
- Validation schemas
- Constants and utilities

### `packages/docs`
Docusaurus documentation site for Easy Risk Tracker methodology.

## 🛠️ Key Technologies

- **Monorepo**: Turborepo
- **Frontend**: React 18, Vite, Tailwind CSS
- **Backend**: Node.js, Express, TypeScript
- **Data Fetching**: TanStack Query (React Query)
- **Auth**: JWT with httpOnly cookies
- **Documentation**: Docusaurus
- **Type Safety**: TypeScript across all packages

## 🔐 Environment Variables

See `.env.example` for all configuration options.

## 📝 Scripts

```bash
npm run dev          # Start all packages in dev mode
npm run build        # Build all packages
npm start            # Start production server
npm run clean        # Clean build artifacts
npm run lint         # Lint all packages
npm run type-check   # TypeScript type checking
```

## 🚢 Deployment

The monorepo is optimized for deployment on platforms like Render, Vercel, or Railway:

1. **Build**: `npm run build`
2. **Start**: `npm start`
3. Set environment variables on your platform

## 📖 Documentation

Visit `/docs` route for complete Easy Risk Tracker methodology and scoring documentation.

## 🏛️ Migration from Legacy

This replaces the previous static HTML setup with a modern React-based architecture while preserving all functionality:

- ✅ All demo features migrated to React components
- ✅ API endpoints replace client-side fetch logic
- ✅ Type-safe communication between frontend/backend
- ✅ Improved developer experience with HMR
- ✅ Better code organization and maintainability

## 📄 License

MIT

## 🚀 Deployment on Render

This project is configured for automatic deployment on [Render](https://render.com).

### Quick Deploy

1. Push this repository to GitHub
2. Connect to Render
3. Render will automatically detect the `render.yaml` configuration
4. Your site will be live!

### Manual Setup on Render

If not using the blueprint (recommended: Web Service, not Static Site):

1. **Create New Web Service** (Runtime: Node)
2. **Root Directory:** `deploy`
3. **Build Command:** `npm install && npm run build`
4. **Start Command:** `node packages/api/dist/index.js`
5. **Environment Variables:** set `NODE_ENV=production`

Note: The API server serves the built web app and docs in production.

## 📁 Project Structure

```
deploy/
├── server.js              # Express server for serving static files
├── package.json           # Root package.json with build scripts
├── render.yaml           # Render deployment configuration
├── index.html            # Landing page source
├── public/               # Built public assets (generated)
│   ├── index.html        # Landing page (copied during build)
│   └── 404.html          # Not found page (generated)
├── docs/                 # Docusaurus documentation
│   ├── package.json      # Docusaurus dependencies
│   └── build/           # Built docs (generated, served at /docs/)
├── scripts/
│   └── build-public.js  # Build script for public assets
└── [project-name]/      # Your sub-projects (add as needed)
    └── index.html
```

## 🛠️ Development

### Install Dependencies
```bash
npm install
```

### Build All Projects
```bash
npm run build
```

### Start Server Locally
```bash
npm start
# Visit http://localhost:3000
```

### Development Mode
```bash
npm run dev
```

## 📦 Adding Sub-Projects

1. Create a new folder in the root directory (e.g., `dashboard/`)
2. Add your project files (must include `index.html`)
3. Update [index.html](index.html) to add a link to your new project
4. Rebuild and deploy

Example:
```
deploy/
├── dashboard/
│   ├── index.html
│   ├── style.css
│   └── app.js
```

Access at: `https://yoursite.com/dashboard/`

## 🌐 Routes

- `/` - Landing page with links to all projects
- `/docs/` - Docusaurus documentation (Easy Risk Tracker)
- `/[project-name]/` - Your sub-projects

## 🔧 Environment Variables

No environment variables required for basic operation. Add as needed for your sub-projects.

## 📝 License

MIT
