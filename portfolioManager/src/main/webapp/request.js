function httpGet() {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", '/sentiment', false); // false for synchronous request
    xmlHttp.send(null);
    return xmlHttp.responseText;
}