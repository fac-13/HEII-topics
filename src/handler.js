const fs = require('fs');
const path = require('path');
const {
  getData,
  getUserData,
  postTopic,
  postVote,
  postUser
} = require('./queries');
const querystring = require('querystring');
require('env2')('./.env');
const secret = process.env.SECRET;
const cookie = require('cookie');
const url = require('url');
const bcrypt = require('bcryptjs');
const jwtmodule = require('jsonwebtoken');

const addErrorCookie = (response, errormessage) => {
  response.writeHead(302, {
    'Content-Type': 'text/plain',
    'Set-Cookie': `error=${errormessage}`,
    Location: '/'
  });
  response.end();
};

const staticHandler = (response, filepath) => {
  const extension = filepath.split('.')[1];
  const extensionType = {
    html: 'text/html',
    css: 'text/css',
    js: 'application/javascript',
    ico: 'image/x-icon',
    svg: 'image/svg+xml'
  };

  fs.readFile(path.join(__dirname, '..', filepath), 'utf8', (error, file) => {
    if (error) {
      response.writeHead(500, { 'content-type': 'text/plain' });
      response.end('server error');
    } else {
      response.writeHead(200, { 'content-type': extensionType[extension] });
      response.end(file);
    }
  });
};

const getDataHandler = response => {
  console.log('get to datahandler');
  getData((err, res) => {
    if (err) {
      console.log('ERROR AT GET DATA HANDLER');
      response.writeHead(500, { 'content-type': 'text/plain' });
      response.end('server error');
    } else {
      let output = JSON.stringify(res);
      response.writeHead(200, { 'content-type': 'application/json' });
      response.end(output);
    }
  });
};

const postTopicHandler = (request, response) => {
  const userCookie = request.headers.cookie;
  if (!userCookie) return addErrorCookie(response, 'need to log in');
  const { jwt } = cookie.parse(userCookie);
  if (!jwt) return addErrorCookie(response, 'need to log in');
  jwtmodule.verify(jwt, secret, (err, jwt) => {
    if (err) {
      return addErrorCookie(
        response,
        'error valiating you, clear cache and login again'
      );
    } else {
      let body = '';
      request.on('data', chunk => (body += chunk));
      request.on('end', () => {
        const data = querystring.parse(body);
        const topic_title = data.topic_title;
        const description = data.description;
        postTopic(topic_title, description, (err, res) => {
          if (err) {
            console.log(err);
            response.writeHead(500, { 'content-type': 'text/plain' });
            response.end('Something went wrong');
          } else {
            response.writeHead(303, { Location: '/' });
            response.end(`Successfully added ${topic_title}`);
          }
        });
      });
    }
  });
};

const postVoteHandler = (request, response) => {
  let params = querystring.parse(request.url);
  let topic_id = params.topic;
  let user_id = params.user;
  let body = '';
  request.on('data', chunk => (body += chunk));
  request.on('end', () => {
    const data = querystring.parse(body);

    if (!userCookie) return addErrorCookie(response, 'need to log in');
    const { jwt } = cookie.parse(userCookie);
    if (!jwt) return addErrorCookie(response, 'need to log in');
    jwtmodule.verify(jwt, secret, (err, jwt) => {
      if (err) {
        return addErrorCookie(
          response,
          'error valiating you, clear cache and login again'
        );
      } else {
        let params = querystring.parse(request.url);
        let topic_id = params.topic;
        let user_id = params.user;
        let body = '';
        request.on('data', chunk => (body += chunk));
        request.on('end', () => {
          const data = querystring.parse(body);

          let vote_value = data.vote;
          postVote(topic_id, user_id, vote_value, (err, res) => {
            if (err) {
              console.log(err);
              response.writeHead(500, { 'content-type': 'text/plain' });
              response.end('Something went wrong');
            } else {
              response.writeHead(303, {
                Location: '/',
                'content-type': 'text/plain'
              });
              response.end(`Successfully added ${vote_value}`);
            }
          });
        });
      }
    });
  });
};

const loginHandler = (request, response) => {
  let body = '';
  request.on('data', chunk => (body += chunk));
  request.on('end', () => {
    const { username, password } = querystring.parse(body);
    getUserData(username, (err, dbResponse) => {
      const user = dbResponse[0];
      if (user) {
        bcrypt.compare(password, user.password, (err, compare) => {
          if (compare) {
            const userInfo = {
              userId: user.id,
              role: user.role
            };
            const jwtCookie = jwtmodule.sign(userInfo, secret);
            response.writeHead(302, {
              location: '/',
              'Set-Cookie': `jwt=${jwtCookie}; HttpOnly; Max-Age=90000`
            });
            response.end();
          } else {
            response.writeHead(200, {
              'content-type': 'text/plain'
            });
            response.end('password doesnt match db');
          }
        });
      } else {
        response.writeHead(200, {
          'content-type': 'text/plain'
        });
        response.end('user doesnt exist');
      }
    });
  });
};

const postUserHandler = (request, response) => {
  let password;
  let body = '';
  request.on('data', chunk => (body += chunk));
  request.on('end', () => {
    const userData = querystring.parse(body);
    let { username, password } = userData;

    getUserData(username, (err, res) => {
      if (!res) {
        response.writeHead(200, {
          'content-type': 'text/plain'
        });
        response.end('username already taken');
      } else {
        bcrypt.hash(password, 8, (err, hashedPassword) => {
          if (err) {
            console.log(err);
          }
          postUser(username, hashedPassword, (err, res) => {
            if (err) {
              console.log(err);
              response.writeHead(500, { 'content-type': 'text/plain' });
              response.end('Something went wrong');
            } else {
              console.log('posted user to db');
              response.writeHead(303, {
                Location: '/',
                'content-type': 'text/plain'
              });
              response.end(`Successfully added ${username}`);
            }
          });
        });
      }
    });
  });
};

// bcrypt.hash(password, 8, callback)
// const comparePasswords = (password, hashedPassword, callback) => {
//   bcrypt.compare(password, hashedPassword, callback);

module.exports = {
  staticHandler,
  getDataHandler,
  postTopicHandler,
  postVoteHandler,
  loginHandler,
  postUserHandler
};
