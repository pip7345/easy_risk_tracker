# Quick Start Guide

## ✅ Build Successful!

All packages have been built successfully. Here's how to run the project:

## 🚀 Running Development Mode

```bash
# Start all services (web, api, docs) in parallel
npm run dev
```

This will start:
- **Frontend (React)**: http://localhost:5173
- **API (Express)**: http://localhost:3000
- **Docs (Docusaurus)**: http://localhost:3001

## 🔍 Individual Package Commands

### Start only the API:
```bash
cd packages/api
npm run dev
```

### Start only the Frontend:
```bash
cd packages/web
npm run dev
```

### Start only the Docs:
```bash
cd packages/docs
npm run dev
```

## 🏭 Production

### Build (already done):
```bash
npm run build
```

### Start production server:
```bash
npm start
```

## 🔧 Environment Setup

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Edit `.env` and add your keys:
   - `JWT_SECRET` - Generate with: `openssl rand -base64 32`
   - `OPENAI_API_KEY` - Your OpenAI API key (optional)
   - `IIZR_EMAIL` - Your IIZR email (optional)
   - `IIZR_PASSWORD` - Your IIZR password (optional)

## 📦 Package Structure

- `packages/web` - React frontend
- `packages/api` - Express backend
- `packages/shared` - Shared TypeScript types
- `packages/docs` - Docusaurus documentation

## 🛠️ Useful Commands

```bash
npm run build        # Build all packages
npm run dev          # Development mode (all packages)
npm run clean        # Clean build artifacts
npm run type-check   # TypeScript type checking
npm run lint         # Lint all packages
```

## 🌐 Routes

After starting dev mode:

- `/` - Landing page with project links
- `/demo` - Simple demo (project fetch + AI)
- `/demo-full` - Advanced dashboard
- `/login` - Authentication page
- `/docs` - Documentation (runs on separate port 3001)

## 📝 Next Steps

1. ✅ Build completed successfully
2. Configure environment variables in `.env`
3. Run `npm run dev` to start development
4. Visit http://localhost:5173
5. Test the demos and functionality

## 🐛 Troubleshooting

**Port already in use?**
- Change ports in:
  - `packages/web/vite.config.ts` (default: 5173)
  - `packages/api/src/index.ts` (default: 3000)
  - `packages/docs/package.json` (default: 3001)

**Dependencies missing?**
```bash
npm install
```

**TypeScript errors?**
```bash
npm run type-check
```
