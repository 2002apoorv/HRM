const http = require('http');

const PORT = 5174;
const TARGET_PORT = 5173;

const server = http.createServer((req, res) => {
  const options = {
    hostname: 'localhost',
    port: TARGET_PORT,
    path: req.url,
    method: req.method,
    headers: { ...req.headers, host: `localhost:${TARGET_PORT}` }
  };

  const proxy = http.request(options, (targetRes) => {
    res.writeHead(targetRes.statusCode, targetRes.headers);
    targetRes.pipe(res, { end: true });
  });

  proxy.on('error', (err) => {
    res.writeHead(502, { 'Content-Type': 'text/plain' });
    res.end('Gateway Error forwarding to 5173: ' + err.message);
  });

  req.pipe(proxy, { end: true });
});

// WebSocket support for Vite HMR
server.on('upgrade', (req, socket, head) => {
  const proxy = http.request({
    hostname: 'localhost',
    port: TARGET_PORT,
    path: req.url,
    method: req.method,
    headers: { ...req.headers, host: `localhost:${TARGET_PORT}` }
  });

  proxy.on('upgrade', (targetRes, targetSocket, targetHead) => {
    socket.write('HTTP/1.1 101 Switching Protocols\r\n' +
      Object.keys(targetRes.headers).map(k => `${k}: ${targetRes.headers[k]}`).join('\r\n') + '\r\n\r\n');
    targetSocket.pipe(socket);
    socket.pipe(targetSocket);
  });

  proxy.on('error', (err) => {
    socket.destroy();
  });

  proxy.end();
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`[Proxy] Listening on http://localhost:${PORT} -> forwarding to http://localhost:${TARGET_PORT}`);
});
