const BASE = 'http://localhost:1234/'

// code adapté de la page HTML5 Rocks : https://www.html5rocks.com/en/tutorials/cors/

// Create the XHR object.
function createCORSRequest(method, url) {
    var xhr = new XMLHttpRequest();

    if ("withCredentials" in xhr) {
        // XHR for Chrome/Firefox/Opera/Safari.
        xhr.open(method, url, true);
    } else if (typeof XDomainRequest != "undefined") {
        // XDomainRequest for IE.
        xhr = new XDomainRequest();
        xhr.open(method, url);
    } else {
        // CORS not supported.
        xhr = null;
    }

    return xhr;
}

// Helper method to parse the title tag from the response.
function getTitle(text) {
    return text.match('<title>(.*)?</title>')[1];
}

// Make the actual CORS request.
function makeCorsRequest(method, url, object) {
    // Retourne une promesse, le résultat est transmis dans la fonction du then, exemple :
    // makeCorsRequest("http://yolo").then(
    //   function(result){},
    //   function(error){}
    // );
    return new Promise(function (resolve, reject) {
        var xhr = createCORSRequest(method, BASE + url);
        if (!xhr) {
            alert('CORS not supported');
            return;
        }

        // Response handlers.
        xhr.onload = function () {
            resolve(xhr.responseText);
        };

        xhr.onerror = function (e) {
            alert('Woops, there was an error making the request.', e);
            reject(e);
        };

        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.send(object);

    })
}
