# Crypto Bros Platform

Multi-project platform featuring the Easy Risk Tracker documentation and additional sub-projects.

## 🚀 Deployment on Render

This project is configured for automatic deployment on [Render](https://render.com).

### Quick Deploy

1. Push this repository to GitHub
2. Connect to Render
3. Render will automatically detect the `render.yaml` configuration
4. Your site will be live!

### Manual Setup on Render

If not using the blueprint:

1. **Create New Web Service**
2. **Build Command:** `npm install && npm run build`
3. **Start Command:** `npm start`
4. **Environment:** Node

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
