// script.js

// Add an event listener to the "Submit" button that triggers when it's clicked
document.getElementById('submit').addEventListener('click', async () => {
    // Retrieve the user's prompt from the textarea with id="prompt"
    const prompt = document.getElementById('prompt').value;
  
    // Reference the div where we'll display the response
    const responseDiv = document.getElementById('response');
  
    // Display a loading message while waiting for the response
    responseDiv.innerHTML = 'Loading...';
  
    try {
      // Send a POST request to our backend API with the prompt
      const res = await fetch('/api/prompt', {
        method: 'POST', // We're sending a POST request
        headers: { 'Content-Type': 'application/json' }, // Specify that we're sending JSON data
        body: JSON.stringify({ prompt }), // Convert the prompt to a JSON string
      });
  
      // Check if the response status is not in the 200-299 range
      if (!res.ok) {
        // Throw an error to be caught in the catch block
        throw new Error('Network response was not ok');
      }
  
      // Parse the JSON response from the server
      const data = await res.json();
  
      // Display the response from the OpenAI API in the responseDiv
      responseDiv.innerHTML = data.response;
    } catch (error) {
      // Log any errors to the console for debugging
      console.error('Error:', error);
  
      // Inform the user that an error occurred
      responseDiv.innerHTML = 'An error occurred.';
    }
  });
  