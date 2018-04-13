(function() {
  var errorMessage = document.getElementById('submitError');

  // FORM VALIDATION

  // registration form
  var regForm = document.querySelector('.js-reg-form');

  var regUsername = document.querySelector('.js-reg-username');
  var regUsernameErr = document.querySelector('.js-reg-username-err');

  var regPassword = document.querySelector('.js-reg-password');
  var regConfirm = document.querySelector('.js-reg-confirm');
  var regPasswordErr = document.querySelector('.js-reg-password-err');

  var regSubmit = document.querySelector('.js-reg-submit');

  regForm.addEventListener('submit', function(event) {
    regUsernameErr.innerText = '';
    regPasswordErr.innerText = '';

    if (regUsername.validity.valueMissing) {
      regUsernameErr.classList.remove('is-hidden');
      regUsernameErr.innerText = 'Please enter an username';
      event.preventDefault();
    }
    if (regPassword.validity.valueMissing || regConfirm.validity.valueMissing) {
      regPasswordErr.classList.remove('is-hidden');
      regPasswordErr.innerText = 'Please enter a password';
      event.preventDefault();
    }
    if (
      regPassword.validity.patternMismatch ||
      regConfirm.validity.patternMismatch
    ) {
      regPasswordErr.classList.remove('is-hidden');
      regPasswordErr.innerText =
        'Password should contain at least eight characters, including one uppercase letter, one lowercase letter and one number';
      event.preventDefault();
    }
    if (regPassword.value != regConfirm.value) {
      regPasswordErr.innerText = 'Passwords do not match';
      regPasswordErr.classList.remove('is-hidden');
      event.preventDefault();
    }
    // error handling if username input already exists on database
    //     - with regUsernameErr.innerText = "username already taken"
  });

  // login form
  var lgnForm = document.querySelector('.js-lgn-form');

  var lgnUsername = document.getElementById('lgn-username');
  var lgnUsernameErr = document.querySelector('.js-lgn-username-err');

  var lgnPassword = document.getElementById('lgn-password');
  var lgnPasswordErr = document.querySelector('.js-lgn-password-err');

  var lgnSubmit = document.querySelector('.js-lgn-submit');
  lgnForm.addEventListener('submit', function(event) {
    lgnUsernameErr.innerText = '';
    lgnPasswordErr.innerText = '';

    if (lgnUsername.validity.valueMissing) {
      console.log('login username validity');
      lgnUsernameErr.classList.remove('is-hidden');
      lgnUsernameErr.innerText = 'Please enter an username';
      event.preventDefault();
    }
    if (lgnPassword.validity.valueMissing) {
      ('login passwrd validity');
      lgnPasswordErr.classList.remove('is-hidden');
      lgnPasswordErr.innerText = 'Please enter a password';
      event.preventDefault();
    }
  });

  // RENDERING ETC
  var topicList = document.querySelector('.js-topic-list');

  var clear = function(parent) {
    while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
    }
  };

  var displayError = function() {
    errorMessage.classList.add('is-hidden');
    if (document.cookie !== 'message=OK' && document.cookie) {
      errorMessage.textContent = document.cookie.split('=')[1];
      errorMessage.classList.remove('is-hidden');
    }
  };

  errorMessage.classList.add('is-hidden');

  var renderFunc = function(res) {
    clear(topicList);
    displayError();
    res.reverse();
    res.forEach(function(obj) {
      // create topic container
      var topic = document.createElement('div');
      topic.classList.add('topic');
      // create title and description
      var topicTitle = document.createElement('h2');
      topicTitle.classList.add('topic__title');
      var topicDescription = document.createElement('p');
      topicDescription.classList.add('topic__description');
      // create avatar
      var topicAvatar = document.createElement('img');
      topicAvatar.classList.add('topic__avatar');
      topicAvatar.setAttribute('width', '20');
      topicAvatar.setAttribute('height', '20');
      topicAvatar.setAttribute('src', 'https://sigil.cupcake.io/' + obj.author);
      // create author
      var topicAuthor = document.createElement('span');
      topicDescription.classList.add('topic__author');
      // create voting chart container
      var topicVotingChart = document.createElement('div');
      topicVotingChart.classList.add('topic__voting');
      // create yes and no vote counters
      var topicVotingYes = document.createElement('span');
      topicVotingYes.classList.add('topic__voting__yes');
      var topicVotingNo = document.createElement('span');
      topicVotingNo.classList.add('topic__voting__no');
      // create vote form
      var topicVoteForm = document.createElement('div');
      topicVoteForm.classList.add('vote');
      topicVoteForm.innerHTML = `<form method="POST" action="/post/vote?topic=${
        obj.id
      }" class="vote__form">
      <input type="radio" name="vote" value="true" class="vote__yes">
      <label for="vote__yes"> Yay! </label>
      <input type="radio" name="vote" value="false" class="vote__no">
      <label for="vote__no"> Nay! </label>
      <button type="submit" class="vote__submit">Submit</button>
      </form>`;
      // create comment counter
      var topicNumComments = document.createElement('span');
      topicNumComments.classList.add('topic__num-comments');

      // set textContents
      topicTitle.textContent = obj.title;
      topicDescription.textContent = obj.description;
      topicAuthor.textContent = obj.author;
      topicVotingYes.textContent = 'yes votes: ' + obj.yes_votes + ' - ' + ' ';
      topicVotingNo.textContent = 'no votes: ' + obj.no_votes;
      topicNumComments.textContent = 'Number of Comments: ' + obj.num_comments;

      // append title, description, avatar and author
      topic.appendChild(topicTitle);
      topic.appendChild(topicDescription);
      topic.appendChild(topicAvatar);
      topic.appendChild(topicAuthor);
      // append yes and no vote counters to chart and append chart
      topicVotingChart.appendChild(topicVotingYes);
      topicVotingChart.appendChild(topicVotingNo);
      topic.appendChild(topicVotingChart);
      // append vote form
      topic.appendChild(topicVoteForm);
      // append number of comment
      topic.appendChild(topicNumComments);

      // append topic to container
      topicList.appendChild(topic);
    });
  };

  utility.fetch('/get/topics', function(err, res) {
    if (err) console.log(err);
    renderFunc(res);
  });
})();
