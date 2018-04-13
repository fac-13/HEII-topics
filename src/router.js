const {
  staticHandler,
  getDataHandler,
  postTopicHandler,
  postVoteHandler,
  loginHandler,
  postUserHandler
} = require('./handler');
const querystring = require('querystring');
require('env2')('./.env');

const router = (request, response) => {
  const url = request.url;
  if (url === '/') {
    staticHandler(response, '/public/index.html');
  } else if (url.indexOf('public') !== -1) {
    staticHandler(response, url);
  } else if (url === '/get/topics') {
    getDataHandler(response);
  } else if (url === '/get/user') {
    getUserHandler(response);
  } else if (url === '/post/topic') {
    postTopicHandler(request, response);
  } else if (url.indexOf('post/vote') !== -1) {
    postVoteHandler(request, response);
  } else if (url === '/login') {
    loginHandler(request, response);
  } else if (url === '/registration') {
    postUserHandler(request, response);
  } else {
    response.writeHead(404, { 'content-type': 'text/plain' });
    response.end('404 error');
  }
};
module.exports = router;
