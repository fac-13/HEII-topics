const { getData, postData } = require("./dynamic");
const { staticHandler, getDataHandler, postDataHandler } = require("./handler");
const querystring = require("querystring");

const router = (request, response) => {
  const url = request.url;

  if (url === "/") {
    staticHandler(response, "/public/index.html");
  } else if (url.indexOf("public") !== -1) {
    staticHandler(response, url);
  } else if (url.indexOf("get/topics") !== -1) {
    getDataHandler(
      response,
      "SELECT topic.name, topic.description, users.username FROM topic, users WHERE topic.user_id = users.id"
    );
  } else if ("/create-topic") {
    // postData goes here
    postDataHandler(request, response);
  } else {
    response.writeHead(404, { "content-type": "text/plain" });
    response.end("404 error");
  }
};

module.exports = router;
