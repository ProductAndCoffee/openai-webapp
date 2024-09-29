// server.js

// Load environment variables from the .env file
require('dotenv').config();

// Import required modules
const express = require('express');                    // Express framework for building the server
const cors = require('cors');                          // Middleware to enable Cross-Origin Resource Sharing
const bodyParser = require('body-parser');             // Middleware to parse incoming request bodies
const { Configuration, OpenAIApi } = require('openai'); // OpenAI API client

// Create an instance of the Express application
const app = express();
const port = 3000; // Define the port number

// Middleware setup
app.use(cors());              // Enable CORS for all routes
app.use(bodyParser.json());   // Parse JSON bodies

// Configure the OpenAI API client with your API key
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY, // Your OpenAI API key from the .env file
});

// Create an OpenAIApi instance
const openai = new OpenAIApi(configuration);

// Serve static files from the current directory
app.use(express.static(__dirname));

// API endpoint to handle user prompts
app.post('/api/prompt', async (req, res) => {
  // Extract the prompt from the request body
  const { prompt } = req.body;

  try {
    // Send a request to the OpenAI API to generate a response
    const completion = await openai.createCompletion({
      model: 'text-davinci-003', // Specify the model to use (e.g., 'text-davinci-003')
      prompt: prompt,            // The user's prompt
      max_tokens: 150,           // Maximum number of tokens in the response
      temperature: 0.7,          // Controls the creativity of the response
    });

    // Send the AI's response back to the client
    res.json({ response: completion.data.choices[0].text.trim() });
  } catch (error) {
    // Log the error for debugging purposes
    console.error('Error during OpenAI API call:', error);

    // Check if the error has a response from the API
    if (error.response) {
      // Send the error status and data back to the client
      res.status(error.response.status).send(error.response.data);
    } else {
      // Send a generic 500 error if no response is available
      res.status(500).send('An error occurred while processing your request.');
    }
  }
});

// Start the server and listen on the specified port
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
