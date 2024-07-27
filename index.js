const http = require('http');
const httpProxy = require('http-proxy');

// Create a proxy server
const proxy = httpProxy.createProxyServer({
    secure: false, // This will allow self-signed certificates
    changeOrigin: true, // This will change the origin of the host header to the target URL
  });

// Create an HTTP server to handle requests and proxy them
const server = http.createServer((req, res) => {
  // The target server to which requests will be proxied
  const target = 'https://api.pluto.buidl.so';

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, PATCH',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Credentials': 'true',
      'Content-Length': '0'
    });
    res.end();
    return;
  }

  // Add CORS headers to the response
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // Log the request URL
  console.log(`Proxying request to: ${target}${req.url}`);

  // Proxy the request to the target server
  proxy.web(req, res, { target });
});

// Handle errors
proxy.on('error', (err, req, res) => {
  console.error('Proxy error:', err);

  // Respond with a 500 status code if there is an error
  res.writeHead(500, {
    'Content-Type': 'text/plain'
  });
  res.end('Something went wrong. And we are reporting a custom error message.');
});

// Start the server on port 3000
server.listen(3000, () => {
  console.log('Proxy server is running on http://localhost:3000');
});
