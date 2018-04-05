const { getData, postData } = require('./dynamic');
const staticHandler = require('./handlers');

const router = (request, response) => {
  const url = request.url;

  if (url === "/") {
    staticHandler(response, "public/index.html");
  } else if (url.indexOf("public") !== -1) {
    staticHandler(response, url);
  } else if ("/topics") {
    console.log("search router reached");
    getData((err, res) => {
        if (err) {
            console.log(err);
            response.writeHead(500, {'content-type': 'text/plain'});
            response.end('server error');
        } else {
            let output = JSON.stringify(res);
            response.writeHead(200, {'content-type': 'application/json'});
            response.end(output);
        }
    });
  } else if ("/create-topic") {
    // postData goes here
  } else {
    response.writeHead(404, { "content-type": "text/plain" });
    response.end("404 error");
  }
};

module.exports = router;