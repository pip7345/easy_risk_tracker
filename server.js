const express = require('express');
const compression = require('compression');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Enable compression
app.use(compression());

function escapeHtml(value = '') {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function injectLoginDefaults(html) {
  const email = process.env.username || '';
  const password = process.env.password || '';
  const apiKey = process.env.CHATGPT_API_KEY || '';

  return html
    .replace(/__IIZR_EMAIL__/g, escapeHtml(email))
    .replace(/__IIZR_PASSWORD__/g, escapeHtml(password))
    .replace(/__OPENAI_API_KEY__/g, escapeHtml(apiKey));
}

// Serve demo_full login page with env defaults (if provided)
app.get(['/demo_full', '/demo_full/', '/demo_full/index.html'], (req, res, next) => {
  const loginPath = path.join(__dirname, 'public', 'demo_full', 'index.html');
  if (!fs.existsSync(loginPath)) {
    return next();
  }

  fs.readFile(loginPath, 'utf8', (err, html) => {
    if (err) {
      return next(err);
    }
    res.setHeader('content-type', 'text/html; charset=utf-8');
    res.send(injectLoginDefaults(html));
  });
});

// Serve static files with proper caching
app.use(express.static('public', {
  maxAge: '1d',
  etag: true
}));

// Serve Docusaurus docs from /docs/ path
app.use('/docs', express.static(path.join(__dirname, 'docs', 'build'), {
  maxAge: '1d',
  etag: true
}));

// Serve the landing page at root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Handle 404s
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).send('Something went wrong!');
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Landing page: http://localhost:${PORT}/`);
  console.log(`📚 Documentation: http://localhost:${PORT}/docs/`);
});
