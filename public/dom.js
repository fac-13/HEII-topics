(function () {
  // FORM VALIDATION
  // login form
  var login__form = document.getElementsByTagName("form")[1];
  var login__button = document.getElementById("login__button");

  var lgn__username = document.getElementById("lgn__username");
  var lgn__password = document.getElementById("lgn__password");
  var lgn__error = document.getElementById("lgn__confirmErr");
  var lgn__usernameErr = document.getElementById("lgn__usernameErr");

  login__form.addEventListener("submit", function (event) {

    lgn__usernameErr.innerText = '';
    lgn__error.innerText = '';

    if (lgn__password.validity.valueMissing) {
      lgn__error.innerText = "Please enter a password";
      event.preventDefault();
    }
    
    if (lgn__username.validity.valueMissing) {
      lgn__usernameErr.innerText = "Please enter an username";
      event.preventDefault();
    }
  });

  // registration form
  var registration__form = document.getElementsByTagName("form")[0];
  var registration__button = document.getElementById("registration__button");

  var reg__username = document.getElementById("reg__username");
  var reg__password = document.getElementById("reg__password");
  var reg__error = document.getElementById("reg__confirmErr");
  var reg__confirmpassword = document.getElementById("reg__confirmpassword");
  var registration__button = document.getElementById("registration__button");
  var reg__usernameErr = document.getElementById("reg__usernameErr");

  registration__form.addEventListener("submit", function (event) {

    reg__usernameErr.innerText = '';
    reg__error.innerText = '';

    if (reg__password.validity.valueMissing || reg__confirmpassword.validity.valueMissing) {
      reg__error.innerText = "Please enter a password";
      event.preventDefault();
    }
    if (
      reg__password.validity.patternMismatch ||
      reg__confirmpassword.validity.patternMismatch
    ) {
      reg__error.innerText =
        "Password should contain at least eight characters, including one uppercase letter, one lowercase letter and one number";
      event.preventDefault();
    }
    if (reg__password.value != reg__confirmpassword.value) {
      error.innerText = "Passwords do not match";
      event.preventDefault();
    }

    if (reg__username.validity.valueMissing) {
      reg__usernameErr.innerText = "Please enter an username";
      event.preventDefault();
    }

    // error handling if username input already exists on database
    //     - with reg__usernameErr.innerText = "username already taken"
  });



  // RENDERING ETC
  var user_id = 1;
  var topicResults = document.querySelector('#js-topic-results');

  var clear = function (parent) {
    while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
    }
  };

  utility.fetch('/get/topics', function (err, res) {
    if (err) console.log(err);
    renderFunc(res);
  });

  var renderFunc = function (res) {
    clear(topicResults);

    res.reverse();
    res.forEach(function (obj) {
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
      yesVote.textContent = 'yes votes: ' + obj.yes_votes + ' - ' + ' ';
      noVote.textContent = 'no votes: ' + obj.no_votes;

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
