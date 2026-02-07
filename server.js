const express = require('express');
const compression = require('compression');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable compression
app.use(compression());

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
