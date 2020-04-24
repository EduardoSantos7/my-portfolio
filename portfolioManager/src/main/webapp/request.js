async function getSentiment(message) {
    const Http = new XMLHttpRequest();
    const url = '/sentiment';
    Http.open("GET", url);
    Http.send();
    
    Http.onreadystatechange = (e) => {
        return Http.responseText
    }

}
