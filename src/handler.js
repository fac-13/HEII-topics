const fs = require('fs');
const path = require('path');
const { getData, postData, postVote, postUser } = require('./dynamic');
const querystring = require('querystring');
const url = require('url');
const bcrypt = require('bcryptjs');

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
    console.log('parsed data: ', data);
    const topic_title = data.topic_title;
    console.log(topic_title);
    const description = data.description;
    postData(topic_title, description, (err, res) => {
      if (err) {
        console.log(err);
        response.writeHead(303, { Location: '/' });
        response.writeHead(500, { 'content-type': 'text/plain' });
        response.end('Something went wrong');
      } else {
        console.log('reached');
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
    console.log('parsed data: ', data);
    let value = data.vote;
    postVote(topic_id, user_id, value, (err, res) => {
      if (err) {
        console.log(err);
        response.writeHead(303, { Location: '/' });
        response.writeHead(500, { 'content-type': 'text/plain' });
        response.end('Something went wrong');
      } else {
        console.log('reached');
        response.writeHead(200, { 'content-type': 'text/plain' });
        response.writeHead(303, { Location: '/' });
        response.end(`Successfully added ${value}`);
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
    console.log('parsed Userdata: ', userData);
    let { username, password } = userData;
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
  });
  // bcrypt.hash(password, 8, callback)
  // const comparePasswords = (password, hashedPassword, callback) => {
  //   bcrypt.compare(password, hashedPassword, callback);
};

module.exports = {
  staticHandler,
  getDataHandler,
  postDataHandler,
  postVoteHandler,
  postUserHandler
};
