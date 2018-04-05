var utility = {
  // -- EVENT LISTENERS
  // remember to add prevent default to submit button
  addListener: function(selector, eventName, callback) {
    document.querySelector(selector).addEventListener(eventName, callback);
  },
  //   -- FETCH requests
  fetch: function(url, cb) {
    var xhr = new XMLHttpRequest();

    xhr.addEventListener('load', function() {
      if (xhr.readyState === 4 && xhr.status === 200) {
        console.log('fetch is working', url);
        var response = JSON.parse(xhr.responseText);
        cb(response);
      } else {
        console.log('XHR error', xhr.readyState);
      }
    });
    xhr.open('GET', url, true);
    xhr.send();
  }
};

if (typeof module !== 'undefined') {
  module.exports = utility;
}
