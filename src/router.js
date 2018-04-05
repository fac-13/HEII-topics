const { getData, postData } = require('./dynamic');
const { staticHandler, getDataHandler } = require('./handler');
const querystring = require('querystring');

const router = (request, response) => {
  const url = request.url;

  if (url === '/') {
    staticHandler(response, '/public/index.html');
  } else if (url.indexOf('public') !== -1) {
    staticHandler(response, url);
  } else if (url.indexOf('get/topics') !== -1) {
    getDataHandler(
      response,
      'SELECT topic.name, topic.description, users.username FROM topic, users WHERE topic.user_id = users.id'
    );
  } else if ('/create-topic') {
    // postData goes here
    let body = '';
    request.on('data', chunk => (body += chunk));
    request.on('end', () => {
      const data = querystring.parse(body);
      console.log('parsed data: ', data);
      const topicTitle = data.topic_title;
      const description = data.description;
      postData(topicTitle, description, (err, res) => {
        if (err) {
          console.log(err);
          response.writeHead(303, { Location: '/' });
          response.writeHead(500, { 'content-type': 'text/plain' });
          response.end('Something went wrong');
        } else {
          console.log('reached');
          response.writeHead(200, { 'content-type': 'text/plain' });
          response.writeHead(303, { Location: '/' });
          response.end(`Successfully added ${topicTitle}`);
        }
      });
    });
  } else {
    response.writeHead(404, { 'content-type': 'text/plain' });
    response.end('404 error');
  }
};

module.exports = router;
