(function() {
  var topicResults = document.querySelector("#js-topic-results");

  var clear = function(parent) {
    while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
    }
  };

  utility.fetch("/get/topics", function(err, res) {
    if (err) console.log(err);
    renderFunc(res);
  });

  var renderFunc = function(res) {
    clear(topicResults);

    res.forEach(function(obj) {
      var topicResult = document.createElement("div");
      topicResult.classList.add("topic__result");
      var topicTitle = document.createElement("h2");
      topicTitle.classList.add("topic__title");
      var topicUsername = document.createElement("div");
      topicUsername.classList.add("topic__username");
      var topicDescription = document.createElement("p");
      topicDescription.classList.add("topic__description");

      var topicVote = document.createElement("form");
      topicVote.setAttribute("method", "post");
      topicVote.setAttribute("action", "/create-vote");
      var y = document.createElement("input"); //input element, text
      y.setAttribute("type", "radio");
      y.setAttribute("value", "yes");
      var n = document.createElement("input"); //input element, text
      n.setAttribute("type", "radio");
      n.setAttribute("value", "no");
      topicVote.appendChild(y);
      topicVote.appendChild(n);

      topicTitle.textContent = obj.topic_title;
      topicUsername.textContent = obj.username;
      topicDescription.textContent = obj.description;

      topicResult.appendChild(topicTitle);
      topicResult.appendChild(topicUsername);
      topicResult.appendChild(topicDescription);
      topicResult.appendChild(topicVote);

      topicResults.appendChild(topicResult);
    });
  };
})();

// -- CALLBACK FUNCTIONS
// dom manipulation to update after receiving data
