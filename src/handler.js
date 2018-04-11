const fs = require('fs');
const path = require('path');
const { getData, postData, postVote, checkUserExists } = require('./dynamic');
const querystring = require('querystring');
const url = require('url');
require('env2')('./.env');
const secret = process.env.SECRET;
const cookie = require('cookie');
const jwt = require('jsonwebtoken');

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
  const query = `SELECT
  t.id,
  t.topic_title AS title,
  t.description,
  u.username AS author,
  COUNT(CASE WHEN v.vote_value = true THEN 1 ELSE null END) AS yes_votes,
  COUNT(CASE WHEN v.vote_value = false THEN 1 ELSE null END) AS no_votes
FROM voting v
RIGHT JOIN topic t
ON t.id = v.topic_id
INNER JOIN users u
ON t.user_id = u.id
GROUP BY t.id, u.username
ORDER BY t.id`;
  getData(query, (err, res) => {
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

const postDataHandler = (request, response) => {
  let body = '';
  request.on('data', chunk => (body += chunk));
  request.on('end', () => {
    const data = querystring.parse(body);

    const topic_title = data.topic_title;

    const description = data.description;
    postData(topic_title, description, (err, res) => {
      if (err) {
        console.log(err);
        response.writeHead(303, { Location: '/' });
        response.writeHead(500, { 'content-type': 'text/plain' });
        response.end('Something went wrong');
      } else {
        response.writeHead(200, { 'content-type': 'text/plain' });
        response.writeHead(303, { Location: '/' });
        response.end(`Successfully added ${topic_title}`);
      }
    });
  });
};

const postVoteHandler = (request, response) => {
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
};

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
              const jwtCookie = jwt.sign(userInfo, secret);

              response.writeHead(302, {
                location: '/',
                'Set-Cookie': `jwt=${jwtCookie}; HttpOnly; Max-Age=90000;`
              });
              response.end();
            } else {
              response.writeHead(200, {
                'content-type': 'text/plain'
              });
              response.end('password doesnt match db');
            }
          }
        );
      } else {
        response.writeHead(200, {
          'content-type': 'text/plain'
        });
        response.end('user doesnt exist');
      }
    });
  });
};

module.exports = {
  staticHandler,
  getDataHandler,
  postDataHandler,
  postVoteHandler,
  loginHandler
};
