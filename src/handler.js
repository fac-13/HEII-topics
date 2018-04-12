const fs = require('fs');
const path = require('path');
const {
  getData,
  postData,
  postVote,
  checkUserExists,
  postUser
} = require('./dynamic');
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
  const query = `SELECT t.topic_title AS title,
  t.description,
  u.username AS author,
  t.id,
  COUNT(CASE WHEN v.value = 'yes' THEN 1 ELSE null END) AS yes_votes,
  COUNT(CASE WHEN v.value = 'no' THEN 1 ELSE null END) AS no_votes,
  COUNT(c.*) AS comments
FROM topics t
LEFT JOIN users u
ON t.user_id = u.id
LEFT JOIN voting v
ON t.id = v.topic_id
LEFT JOIN comments c
ON t.id = c.topic_id
GROUP BY t.id, u.username
ORDER BY t.id`;
  getData(query, (err, res) => {
    if (err) {
      console.log('ERROR AT GET DATA HANDLER');
      response.writeHead(500, { 'content-type': 'text/plain', 'Set-Cookie': 'message=OK' });
      response.end('server error');
    } else {
      let output = JSON.stringify(res);
      response.writeHead(200, { 'content-type': 'application/json', 'Set-Cookie': 'message=OK' });
      response.end(output);
    }
  });
};

const postDataHandler = (request, response) => {

  const userCookie = request.headers.cookie;

  if (!userCookie) return addErrorCookie(response, "need to log in");
  const { jwt } = cookie.parse(userCookie);
  if (!jwt) return addErrorCookie(response, "need to log in");
  jwtmodule.verify(jwt, secret, (err, jwt) => {
    if (err) {
      return addErrorCookie(response, "error valiating you, clear cache and login again");
    } else {
      let body = '';
      request.on('data', chunk => (body += chunk));
      request.on('end', () => {
        const data = querystring.parse(body);

        const topic_title = data.topic_title;

        const description = data.description;
        postData(topic_title, description, (err, res) => {
          if (err) {
            console.log(err);
            addErrorCookie(response, "can't post data, try logging in, error: " + err);
          } else {
            response.writeHead(303, { 'content-type': 'text/plain', 'Set-Cookie': 'message=OK', Location: '/' });
            response.end(`Successfully added ${topic_title}`);
          }
        });
      });
    }
  });


};

const postVoteHandler = (request, response) => {
  const userCookie = request.headers.cookie;

  if (!userCookie) return addErrorCookie(response, "need to log in");
  const { jwt } = cookie.parse(userCookie);
  if (!jwt) return addErrorCookie(response, "need to log in");
  jwtmodule.verify(jwt, secret, (err, jwt) => {
    if (err) {
      return addErrorCookie(response, "error valiating you, clear cache and login again");
    } else {
      // let topic_id = querystring
      //   .parse(request.url)
      //   ['create-vote/?topic'].toLowerCase()
      //   .trim();
      // const { topic_id, user_id } = url.parse(request.url);
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
            addErrorCookie(response, "can't post data, try logging in, error: " + err);
          } else {
            response.writeHead(303, {
              Location: '/',
              'content-type': 'text/plain',
              'Set-Cookie': 'message=OK'
            });
            response.end(`Successfully added ${vote_value}`);
          }
        });

      });
    };
  })
}

const loginHandler = (request, response) => {
  let body = '';
  request.on('data', chunk => (body += chunk));
  request.on('end', () => {
    const data = querystring.parse(body);
    checkUserExists(data.username, (err, exists) => {
      if (exists == true) {
        getData(
          `SELECT password, id, role FROM users WHERE username = '${
          data.username
          }';`,
          (err, dbResponse) => {
            if (dbResponse[0].password == data.password) {
              const userInfo = {
                userId: dbResponse[0].id,
                role: dbResponse[0].role
              };
              const jwtCookie = jwtmodule.sign(userInfo, secret);

              response.writeHead(302, {
                location: '/',
                'Set-Cookie': [`jwt=${jwtCookie}; HttpOnly; Max-Age=90000;`, 'message=OK']
              });
              response.end();
            } else {
              addErrorCookie(response, "password doesnt match db");
            }
          }
        );
      } else {
        addErrorCookie(response, "user doesnt exist");
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

    checkUserExists(username, (err, exists) => {
      if (exists == true) {
        addErrorCookie(response, "username already taken");
      } else {
        bcrypt.hash(password, 8, (err, hashedPassword) => {
          if (err) {
            console.log(err);
          }
          postUser(username, hashedPassword, (err, res) => {
            if (err) {
              console.log(err);
              addErrorCookie(response, "can't post data, something went wrong: " + err);
            } else {
              console.log('posted user to db');
              response.writeHead(303, {
                Location: '/',
                'content-type': 'text/plain',
                'Set-Cookie:': 'message=OK'
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
  postDataHandler,
  postVoteHandler,
  loginHandler,
  postUserHandler
};
