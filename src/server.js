const http = require('http');
const router = require('./router');

const host = process.env.HOST || 'localhost';
const port = process.env.PORT || 3000;

const server = http.createServer(router);

server.listen(port, function() {
  console.log('server running on: http://' + host + ':' + port);
});
