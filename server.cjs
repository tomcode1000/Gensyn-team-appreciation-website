const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 52119;

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.json': 'application/json',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2'
};

// Function to decode URI components safely
function safeDecodeURI(uri) {
  try {
    return decodeURIComponent(uri);
  } catch (e) {
    return uri;
  }
}

const server = http.createServer((req, res) => {
  console.log(`Request received: ${req.method} ${req.url}`);
  
  let filePath = req.url === '/' ? '/index.html' : req.url;
  
  // Remove query parameters if any
  if (filePath.includes('?')) {
    filePath = filePath.split('?')[0];
  }
  
  // Decode URI components
  filePath = safeDecodeURI(filePath);
  
  // Security check - prevent directory traversal
  if (filePath.includes('..')) {
    res.writeHead(403);
    res.end('403 Forbidden');
    return;
  }
  
  // Resolve the full path
  const fullPath = path.resolve('.') + path.normalize(filePath);
  
  console.log(`Full path: ${fullPath}`);
  
  const extname = path.extname(fullPath).toLowerCase();
  const contentType = MIME_TYPES[extname] || 'application/octet-stream';
  
  fs.readFile(fullPath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        // File not found
        console.log(`File not found: ${fullPath}`);
        res.writeHead(404);
        res.end('404 Not Found');
      } else {
        // Server error
        console.log(`Server error: ${err.code}`);
        res.writeHead(500);
        res.end('500 Internal Server Error');
      }
    } else {
      // Success
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
  console.log(`Serving files from: ${path.resolve('.')}`);
});