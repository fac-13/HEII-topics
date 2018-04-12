const { getData, postData } = require('./dynamic');
const {
  staticHandler,
  getDataHandler,
  postDataHandler,
  postVoteHandler,
  loginHandler,
  postUserHandler
} = require('./handler');
const cookie = require('cookie');
const querystring = require('querystring');
require('env2')('./.env');
const secret = process.env.SECRET;
const jwtmodule = require('jsonwebtoken');

const router = (request, response) => {
  const url = request.url;
  if (url === '/') {
    staticHandler(response, '/public/index.html');
    // SEND BACK A COOKIE LOGGED IN OR NOT??
  } else if (url.indexOf('public') !== -1) {
    staticHandler(response, url);
  } else if (url === '/get/topics') {
    getDataHandler(response);
  } else if (url === '/create-topic') {
    postDataHandler(request, response);
  } else if (url.indexOf('create-vote') !== -1) {
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
