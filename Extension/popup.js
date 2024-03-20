var search_topic;
var hooya;
$(function(){
    // This code is wrapped in a jQuery document ready function.
    // It ensures that the enclosed code is executed only after the DOM (Document Object Model) has fully loaded.

    $('#imageInput').on('change', function(){
        const input = document.getElementById('imageInput');
	if (input.files && input.files[0]) {
		const file = input.files[0];
		
		// Create a FileReader
		const reader = new FileReader();
	
		// Set the onload event handler to convert the image to base64
		reader.onload = function (e) {
		  const base64Image = e.target.result;
		  
		  // Display the base64 image in the preview
		  document.getElementById('previewImage').src = base64Image;
		  // Do something with the base64 image (e.g., send it to the server)
	
		  search_topic=base64Image;
		 

		};
		reader.readAsDataURL(file);
	



}
    });
});


$(function(){
    function handleResponse(message) {
        document.getElementById("heading").innerHTML = message.response;
      }
      
      function handleError(error) {
        console.log(`Error: ${error}`);
      }
    
      $('#keywordsubmit').click(function(){
        var textBoxValue = document.getElementById("myTextBox").value;
        document.getElementById("heading").innerHTML = textBoxValue;
        textBoxValue = search_topic;
        
        const sendingPromise = new Promise((resolve, reject) => {
            // Send a message to the background script
chrome.runtime.sendMessage({ type: textBoxValue }, function(response) {
    // Handle the response received from the background script
    console.log("Background script response:", response);
    document.getElementById("title").innerHTML = response.response;
});

        });
    
        sendingPromise.then(handleResponse).catch(handleError);
    });
    
});