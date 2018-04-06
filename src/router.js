const { getData, postData } = require('./dynamic');
const { staticHandler, getDataHandler, postDataHandler } = require('./handler');
const querystring = require('querystring');

const router = (request, response) => {
  const url = request.url;

  if (url === '/') {
    staticHandler(response, '/public/index.html');
  } else if (url.indexOf('public') !== -1) {
    staticHandler(response, url);
  } else if (url === '/get/topics') {
    getDataHandler(
      response,
      'SELECT topic.id, topic.topic_title, topic.description, users.username FROM topic, users WHERE topic.user_id = users.id;'
    );
  } else if (url === '/create-topic') {
    // else if (url.indexOf('votes') !== -1) {
    //   let topicId = url.split('/')[1];
    //   getDataHandler(
    //     response,
    //     `SELECT COUNT(vote_value) FROM voting WHERE vote_value = true AND topic_id=${topicId};`
    //   );
    // }
    // postData goes here
    postDataHandler(request, response);
  } else if (url === '/create-vote') {
    function postVoteHandler(request, response) {
      console.log('Reached create-vote route');
      console.log(request);
    }
  } else {
    response.writeHead(404, { 'content-type': 'text/plain' });
    response.end('404 error');
  }
};
module.exports = router;
