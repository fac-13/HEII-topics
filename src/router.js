const { getData, postData } = require('./dynamic');
const {
  staticHandler,
  getDataHandler,
  postDataHandler,
  postVoteHandler
} = require('./handler');
const querystring = require('querystring');

const router = (request, response) => {
  const url = request.url;
  if (url === '/') {
    staticHandler(response, '/public/index.html');
  } else if (url.indexOf('public') !== -1) {
    staticHandler(response, url);
  } else if (url === '/get/topics') {
    getDataHandler(response);
  } else if (url === '/create-topic') {
    console.log('Reached create-topic route');
    postDataHandler(request, response);
  } else if (url.indexOf('create-vote') !== -1) {
    console.log('Reached create-vote route');
    postVoteHandler(request, response);
  } else {
    response.writeHead(404, { 'content-type': 'text/plain' });
    response.end('404 error');
  }
};
module.exports = router;
