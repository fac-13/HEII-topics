const {
  staticHandler,
  getDataHandler,
  postTopicHandler,
  postVoteHandler,
  loginHandler,
  postUserHandler
} = require('./handler');
const cookie = require('cookie');
const querystring = require('querystring');
require('env2')('./.env');
const secret = process.env.SECRET;

const router = (request, response) => {
  const url = request.url;
  const send401 = () => {
    response.writeHead(401, {
      'Content-Type': 'text/plain'
    });
    response.end("You don't have access, please log in");
  };
  const userCookie = request.headers.cookie;
  const checkJWT = () => {};
  if (url === '/') {
    staticHandler(response, '/public/index.html');
    // SEND BACK A COOKIE LOGGED IN OR NOT??
  } else if (url.indexOf('public') !== -1) {
    staticHandler(response, url);
  } else if (url === '/get/topics') {
    getDataHandler(response);
  } else if (url === '/create-topic') {
    postTopicHandler(request, response);
    if (!userCookie) {
      return send401();
      console.log('no user cookie');
    } else {
      const { jwt } = cookie.parse(userCookie);
      if (!jwt) {
        console.log('cant parse cookie');
        return send401();
      } else {
        jwtmodule.verify(jwt, secret, (err, jwt) => {
          if (err) {
            console.log('jwt cant be verified');
            send401();
          } else {
            console.log('alllll good');
            postUserHandler(request, response);
          }
        });
      }
    }
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
