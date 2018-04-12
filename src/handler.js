const fs = require('fs');
const path = require('path');
const {
  getData,
  getUserData,
  getComments,
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
    'Set-Cookie': `message=${errormessage}`,
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
      response.writeHead(500, {
        'content-type': 'text/plain'
      });
      response.end('server error');
    } else {
      response.writeHead(200, {
        'content-type': extensionType[extension]
      });
      response.end(file);
    }
  });
};

const getDataHandler = response => {
  console.log('get to datahandler');
  getData((err, res) => {
    if (err) {
      console.log('ERROR AT GET DATA HANDLER');
      addErrorCookie(response, 'sorry there was a server error');
    } else {
      let itemsProcessed = 0;
      res.forEach((e, index, array) => {
        getComments(e.id, (err, dbComments) => {
          itemsProcessed++;
          e.comments = dbComments;
          if ((itemsProcessed = array.length)) {
            let output = JSON.stringify(res);
            response.writeHead(200, {
              'content-type': 'application/json',
              'Set-Cookie': 'message=OK'
            });
            response.end(output);
          }
        });
      });
    }
  });
};

const postTopicHandler = (request, response) => {
  const userCookie = request.headers.cookie;
  if (!userCookie) return addErrorCookie(response, 'need to log in');
  const { jwt } = cookie.parse(userCookie);
  if (!jwt) return addErrorCookie(response, 'need to log in');
  jwtmodule.verify(jwt, secret, (err, jwtRes) => {
    if (err) {
      return addErrorCookie(
        response,
        'error validating you, clear cache and login again'
      );
    } else {
      let body = '';
      request.on('data', chunk => (body += chunk));
      request.on('end', () => {
        const data = querystring.parse(body);
        const topic_title = data.topic_title;
        const description = data.description;
        postTopic(topic_title, description, jwtRes.userId, (err, res) => {
          if (err) {
            addErrorCookie(
              response,
              'sorry you cannot vote twice, it is undemocratic'
            );
          } else {
            response.writeHead(303, {
              Location: '/',
              'Set-Cookie': 'message=OK'
            });
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
    const userCookie = request.headers.cookie;
    if (!userCookie) return addErrorCookie(response, 'need to log in');
    const { jwt } = cookie.parse(userCookie);
    if (!jwt) return addErrorCookie(response, 'need to log in');
    jwtmodule.verify(jwt, secret, (err, jwtRes) => {
      if (err) {
        return addErrorCookie(
          response,
          'error valiating you, clear cache and login again'
        );
      } else {
        const data = querystring.parse(body);
        let vote_value = data.vote;
        postVote(topic_id, user_id, vote_value, (err, res) => {
          if (err) {
            console.log(err);
            addErrorCookie(
              response,
              'sorry there was a problem posting your vote'
            );
          } else {
            response.writeHead(303, {
              Location: '/',
              'content-type': 'text/plain',
              'Set-Cookie': 'message=OK'
            });
            response.end(`Successfully added ${vote_value}`);
          }
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
              'Set-Cookie': [
                `jwt=${jwtCookie}; HttpOnly; Max-Age=90000`,
                'message=you are now logged in'
              ]
            });
            response.end();
          } else {
            addErrorCookie(response, 'sorry your password dont match');
          }
        });
      } else {
        addErrorCookie(response, 'sorry the user doesnt exist');
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
        addErrorCookie(
          response,
          'bad luck, that username is already taken, pick another!'
        );
      } else {
        bcrypt.hash(password, 8, (err, hashedPassword) => {
          if (err) {
            console.log(err);
          }
          postUser(username, hashedPassword, (err, res) => {
            if (err) {
              addErrorCookie(
                response,
                'oopsy doodle there was a problemo ' + err.detail
              );
            } else {
              response.writeHead(303, {
                Location: '/',
                'content-type': 'text/plain',
                'Set-Cookie': 'message=thankyou for registering with us'
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
