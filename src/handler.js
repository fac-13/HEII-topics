const fs = require("fs");
const path = require("path");
const { getData, postData } = require("./dynamic");
const querystring = require("querystring");

const staticHandler = (response, filepath) => {
  const extension = filepath.split(".")[1];
  const extensionType = {
    html: "text/html",
    css: "text/css",
    js: "application/javascript",
    ico: "image/x-icon",
    svg: "image/svg+xml"
  };

  fs.readFile(path.join(__dirname, "..", filepath), "utf8", (error, file) => {
    if (error) {
      response.writeHead(500, { "content-type": "text/plain" });
      response.end("server error");
    } else {
      response.writeHead(200, { "content-type": extensionType[extension] });
      response.end(file);
    }
  });
};

const getDataHandler = (response, query) => {
  console.log("get to datahandler");
  getData(query, (err, res) => {
    if (err) {
      console.log("ERROR AT GET DATA HANDLER");
      response.writeHead(500, { "content-type": "text/plain" });
      response.end("server error");
    } else {
      let output = JSON.stringify(res);
      response.writeHead(200, { "content-type": "application/json" });
      response.end(output);
    }
  });
};

const postDataHandler = (request, response) => {
  let body = "";
  request.on("data", chunk => (body += chunk));
  request.on("end", () => {
    const data = querystring.parse(body);
    console.log("parsed data: ", data);
    const topicTitle = data.topic_title;
    const description = data.description;
    postData(topicTitle, description, (err, res) => {
      if (err) {
        console.log(err);
        response.writeHead(303, { Location: "/" });
        response.writeHead(500, { "content-type": "text/plain" });
        response.end("Something went wrong");
      } else {
        console.log("reached");
        response.writeHead(200, { "content-type": "text/plain" });
        response.writeHead(303, { Location: "/" });
        response.end(`Successfully added ${topicTitle}`);
      }
    });
  });
};

module.exports = {
  staticHandler,
  getDataHandler,
  postDataHandler
};
