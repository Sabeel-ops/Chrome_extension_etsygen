'use strict';

var HOST = 'http://127.0.0.1:8080/';

// Listen for messages from content scripts or popups
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    // Check if the message is of a specific type
    var url = request.type;
    get_analyzed_info(url, function(message) {
        // Send a response back
        sendResponse({ response: message }); // Send the actual response received from get_analyzed_info
    });
    // Note: sendResponse must be called asynchronously
    return true;
});


// send URLs
function get_analyzed_info(url, callback) {
    var xhr = new XMLHttpRequest();

    // After the server sends data, the below code will run
    xhr.onload = function() {
        if (xhr.status === 200 || xhr.status === 201) {
            const received_arr = JSON.parse(xhr.response);
            received_arr.forEach(function(elem) {
                var status = elem.status;
                var message = elem.message;
                console.log('Status : ' + status + ', message : ' + message);
            });
            // Pass the message to the callback function
            var kooko = JSON.stringify(received_arr); // Assuming received_arr contains the JSON object
            var parsedKooko = JSON.parse(kooko); // Parsing the JSON string back into an object
            var statusValue = parsedKooko[0].status;
            callback(statusValue);
        } else {
            alert('ERROR : ' + xhr.responseText);
            console.error(xhr.responseText);
            // Pass an error message to the callback function
            callback("Error occurred: " + xhr.responseText);
        }
    };

    var request_url = HOST + 'myapp/user/analyzedinfo/get';

    xhr.open("POST", request_url);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

    // Create an array for send
    var jsonArray = [];

    // 1. Insert data after creation
    var json1 = { url: String(url) };
    jsonArray.push(json1);

    // 2. Insert data with creation
    var json2 = { url: 'https://www.google.com/' };
    jsonArray.push(json2);

    var json3 = { url: 'Hello my children' };
    jsonArray.push(json3);

    var json4 = { url: 'https://duckduckgo.com/' };
    jsonArray.push(json4);

    var json5 = { url: 'https://yandex.com/' };
    jsonArray.push(json5);

    var dataJSON = JSON.stringify(jsonArray);

    // Send JSON array
    xhr.send(dataJSON);
}
