var utility = {
  // -- EVENT LISTENERS
  // remember to add prevent default to submit button
  addListener: function(selector, eventName, cb) {
    document.querySelector(selector).addEventListener(eventName, cb);
  },
  // -- FETCH REQUESTS
  fetch: function(url, cb) {
    var xhr = new XMLHttpRequest();

    xhr.addEventListener('load', function() {
      if (xhr.readyState === 4 && xhr.status === 200) {
        console.log('fetch is working', url);
        var response = JSON.parse(xhr.responseText);
        cb(null, response);
      } else {
        cb(new TypeError('XHR error' + xhr.status));
      }
    });
    xhr.open('GET', url, true);
    xhr.send();
  }
};

if (typeof module !== 'undefined') {
  module.exports = utility;
}
