(function() {
  var user_id = 1;
  var topicResults = document.querySelector('#js-topic-results');

  var clear = function(parent) {
    while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
    }
  };

  utility.fetch('/get/topics', function(err, res) {
    if (err) console.log(err);
    renderFunc(res);
  });

  var renderFunc = function(res) {
    clear(topicResults);

    res.reverse();
    res.forEach(function(obj) {
      var topicResult = document.createElement('div');
      topicResult.classList.add('topic__result');
      var topicTitle = document.createElement('h2');
      topicTitle.classList.add('topic__title');
      var topicUsername = document.createElement('div');
      topicUsername.classList.add('topic__username');
      var topicDescription = document.createElement('p');
      topicDescription.classList.add('topic__description');

      var topicVote = document.createElement('div');
      topicVote.classList.add('vote');

      //radio form
      var radioForm = `<form method='POST' action='/?end=create-vote&topic=${
        obj.id
      }&user=${user_id}' class='vote__form'>
      <input type='radio' name='vote' value='true' id='voting__yes'>
      <label for='voting__yes'> Yay! </label>
      <input type='radio' name='vote' value='false' id='voting__no'>
      <label for='voting__no'> Nay! </label>
      <button type='submit'> Submit </button>
      </form>`;
      topicVote.insertAdjacentHTML('beforeend', radioForm);

      var voteNumbers = document.createElement('div');
      voteNumbers.classList.add('topicvotes');
      var yesVote = document.createElement('span');
      yesVote.classList.add('topicyes');
      var noVote = document.createElement('span');
      noVote.classList.add('topic__no');

      topicTitle.textContent = obj.title;
      topicUsername.textContent = obj.username;
      topicDescription.textContent = obj.description;
      yesVote.textContent = obj.yes_votes;
      noVote.textContent = obj.no_votes;

      topicResult.appendChild(topicTitle);
      topicResult.appendChild(topicUsername);
      topicResult.appendChild(topicDescription);
      topicVote.appendChild(voteNumbers);
      voteNumbers.appendChild(yesVote);
      voteNumbers.appendChild(noVote);

      topicResult.appendChild(topicVote);
      topicResults.appendChild(topicResult);
    });
  };
})();

// -- CALLBACK FUNCTIONS
// dom manipulation to update after receiving data
