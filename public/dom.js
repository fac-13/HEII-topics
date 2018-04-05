  //   -- FETCH requests
  var request = function(url, callback) {
    var xhr = new XMLHttpRequest();

    xhr.addEventListener("load", function() {
      if (xhr.readyState === 4 && xhr.status === 200) {
        console.log("fetch is working", url);
        var response = JSON.parse(xhr.responseText);
        callback(response);
      } else {
        console.log("XHR error", xhr.readyState);
      }
    });
    xhr.open("GET", url, true);
    xhr.send();
  }
};

// -- EVENT LISTENERS
// remember to add prevent default to submit button

// -- CALLBACK FUNCTIONS
// dom manipulation to update after receiving data