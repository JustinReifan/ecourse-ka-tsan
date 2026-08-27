const http = require('http');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const PORT = 8299;
const STATIC_DIR = path.join(__dirname, 'public');
const PHP_PORT = 8199;

// MIME types
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
};

// Compressible MIME types
const COMPRESSIBLE = /^(text\/|application\/(javascript|json|xml|svg\+xml)|image\/svg\+xml)/;

function compressAndSend(res, acceptEncoding, contentType, filePath, cacheControl) {
  const ext = path.extname(filePath).toLowerCase();

  // Set cache headers
  const headers = {
    'Content-Type': contentType,
    'Cache-Control': cacheControl,
    'Access-Control-Allow-Origin': '*',
  };

  if (COMPRESSIBLE.test(contentType) && acceptEncoding && acceptEncoding.includes('gzip')) {
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(500);
        res.end('Internal Server Error');
        return;
      }
      zlib.gzip(data, { level: 6 }, (err2, compressed) => {
        if (err2 || compressed.length >= data.length) {
          headers['Content-Length'] = data.length;
          res.writeHead(200, headers);
          res.end(data);
        } else {
          headers['Content-Encoding'] = 'gzip';
          headers['Content-Length'] = compressed.length;
          headers['Vary'] = 'Accept-Encoding';
          res.writeHead(200, headers);
          res.end(compressed);
        }
      });
    });
  } else {
    // No compression for binary or non-compressible
    const stat = fs.statSync(filePath);
    headers['Content-Length'] = stat.size;
    res.writeHead(200, headers);
    fs.createReadStream(filePath).pipe(res);
  }
}

const server = http.createServer((req, res) => {
  const acceptEncoding = req.headers['accept-encoding'] || '';
  let filePath = path.join(STATIC_DIR, req.url === '/' ? 'index.html' : req.url.split('?')[0]);

  // Check if static file exists
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath).toLowerCase();
    const mime = MIME[ext] || 'application/octet-stream';

    // Set aggressive caching
    let cacheControl;
    if (filePath.includes('/build/assets/')) {
      cacheControl = 'public, max-age=31536000, immutable';
    } else if (/\.(webp|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/i.test(ext)) {
      cacheControl = 'public, max-age=604800';
    } else {
      cacheControl = 'no-cache';
    }

    compressAndSend(res, acceptEncoding, mime, filePath, cacheControl);
  } else {
    // Proxy to PHP
    const proxyReq = http.request({
      hostname: '127.0.0.1',
      port: PHP_PORT,
      path: req.url,
      method: req.method,
      headers: req.headers,
    }, (proxyRes) => {
      const contentType = proxyRes.headers['content-type'] || '';

      // Add cache headers
      let cacheControl = 'no-cache';
      if (req.url.includes('/build/assets/')) {
        cacheControl = 'public, max-age=31536000, immutable';
      } else if (/\.(webp|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/i.test(req.url)) {
        cacheControl = 'public, max-age=604800';
      }

      if (COMPRESSIBLE.test(contentType) && acceptEncoding.includes('gzip')) {
        const chunks = [];
        proxyRes.on('data', chunk => chunks.push(chunk));
        proxyRes.on('end', () => {
          const body = Buffer.concat(chunks);
          zlib.gzip(body, { level: 6 }, (err, compressed) => {
            if (err || compressed.length >= body.length) {
              const headers = { ...proxyRes.headers, 'Cache-Control': cacheControl };
              delete headers['content-length'];
              delete headers['transfer-encoding'];
              res.writeHead(proxyRes.statusCode, headers);
              res.end(body);
            } else {
              const headers = {
                'content-type': contentType,
                'content-encoding': 'gzip',
                'content-length': compressed.length,
                'cache-control': cacheControl,
                'vary': 'Accept-Encoding',
              };
              res.writeHead(proxyRes.statusCode, headers);
              res.end(compressed);
            }
          });
        });
      } else {
        const headers = { ...proxyRes.headers };
        headers['cache-control'] = cacheControl;
        delete headers['content-length'];
        delete headers['transfer-encoding'];
        res.writeHead(proxyRes.statusCode, headers);
        proxyRes.pipe(res);
      }
    });

    proxyReq.on('error', () => {
      res.writeHead(502);
      res.end('Bad Gateway');
    });

    req.pipe(proxyReq);
  }
});

server.listen(PORT, () => {
  console.log(`Fast server running at http://localhost:${PORT}`);
  console.log('Static files served with gzip compression, dynamic proxied to PHP');
});
