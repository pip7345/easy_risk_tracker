# Crypto Bros Monorepo - Migration Guide

## 🎯 What Changed

This document explains the migration from static HTML to a modern monorepo architecture.

## 📁 Old vs New Structure

### Before:
```
deploy/
├── server.js                 # Single Express server
├── index.html               # Static landing page
├── demo/                    # Demo 1 (static HTML)
│   ├── index.html
│   ├── app.js
│   └── project-fetch.js
├── demo_full/               # Demo 2 (static HTML)
│   ├── index.html
│   └── login.js
├── public/                  # Built static files
└── docs/                    # Docusaurus
```

### After:
```
deploy/
├── packages/
│   ├── web/                # React SPA (all demos unified)
│   ├── api/                # Express REST API
│   ├── shared/             # Shared types
│   └── docs/               # Docusaurus (moved)
├── turbo.json              # Turborepo config
└── package.json            # Root workspace
```

## 🔄 Feature Migration Map

| Old Feature | New Location | Notes |
|------------|--------------|-------|
| `/index.html` | `packages/web/src/pages/Home.tsx` | React component |
| `/demo/` | `packages/web/src/pages/Demo.tsx` | Single page |
| `/demo_full/` | `packages/web/src/pages/DemoFull.tsx` | Dashboard view |
| `project-fetch.js` | `packages/api/src/routes/projects.ts` | Server-side API |
| `ai-query.js` | `packages/api/src/routes/ai.ts` | Server-side API |
| `methodology.js` | Can be in shared or fetched from DB | Flexible |
| `/docs/` | `packages/docs/` | Moved to packages |

## 🔐 Security Improvements

### Before:
- Credentials exposed in client-side JavaScript
- API keys visible in browser
- No authentication layer

### After:
- JWT tokens with httpOnly cookies
- Server-side credential storage
- CORS protection
- API keys never exposed to client

## 🎨 Styling Migration

All CSS has been converted to Tailwind utility classes while preserving the exact color scheme:

```jsx
// Before (demo_full/styles.css)
.button {
  background: var(--accent);
  padding: 10px 16px;
  border-radius: 10px;
}

// After (Tailwind)
<button className="bg-accent px-4 py-2.5 rounded-lg">
```

## 🔌 API Integration

### Before (Client-side fetch):
```javascript
// demo/project-fetch.js
async function fetchProject() {
  const response = await fetch('https://api.iizr.co/...', {
    headers: { Authorization: `Bearer ${token}` }
  });
}
```

### After (API route + React Query):
```typescript
// packages/web/src/pages/Demo.tsx
const { data } = useMutation({
  mutationFn: async () => {
    const res = await fetch('/api/projects/fetch', {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({ projectId })
    });
    return res.json();
  }
});
```

## 📦 Dependencies

New packages added:
- **Turborepo**: Monorepo orchestration
- **React**: UI framework
- **Vite**: Build tool (replaces webpack/none)
- **React Router**: Client-side routing
- **TanStack Query**: Data fetching
- **Tailwind CSS**: Utility-first CSS
- **TypeScript**: Type safety across all packages

## 🚀 Development Workflow

### Before:
```bash
npm install
npm start  # Single server
```

### After:
```bash
npm install           # Install all packages
npm run dev          # Run all packages in parallel
```

This starts:
- Frontend: http://localhost:5173
- API: http://localhost:3000
- Docs: http://localhost:3001

## 📊 Build Output

### Before:
```
public/              # Copied static files
docs/build/          # Docusaurus build
```

### After:
```
packages/web/dist/           # Vite production build
packages/api/dist/           # Compiled TypeScript
packages/docs/build/         # Docusaurus build
packages/shared/dist/        # Compiled shared code
```

## 🎯 Next Steps

1. **Review**: Check all pages work correctly
2. **Migrate Data**: Move any hardcoded data to API/database
3. **Enhance**: Add more React components for demo_full
4. **Test**: Write tests for API routes
5. **Deploy**: Use Render or Vercel

## 📚 Learning Resources

- **Turborepo**: https://turbo.build/repo/docs
- **React Query**: https://tanstack.com/query/latest
- **Tailwind**: https://tailwindcss.com/docs
- **Vite**: https://vitejs.dev/guide/
