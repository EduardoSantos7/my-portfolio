var getSentiment = function (url, method) {
  return getUrl(url, "text", method);
};

var getNews = function (url, method) {
  return getUrl(url, "json", method);
};

var getCompanyIDdata = function (url, method) {
  return getUrl(url, "json", method);
};

var getUrl = function (url, responseType, method) {
  // Create the XHR request
  var request = new XMLHttpRequest();
  request.responseType = responseType;

  // Return it as a Promise
  return new Promise(function (resolve, reject) {
    // Setup our listener to process compeleted requests
    request.onreadystatechange = function () {
      // Only run if the request is complete
      if (request.readyState !== 4) return;

      // Process the response
      if (request.status >= 200 && request.status < 300) {
        // If successful
        resolve(request.response);
      } else {
        // If failed
        reject({
          status: request.status,
          statusText: request.statusText,
        });
      }
    };

    // Setup our HTTP request
    request.open(method || "GET", url, true);

    // Send the request
    request.send();
  });
};
