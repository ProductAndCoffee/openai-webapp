// server.js

// Import Express.js for building the server
const express = require('express');

// Import CORS to handle cross-origin requests
const cors = require('cors');

// Import Body-Parser to parse JSON bodies
const bodyParser = require('body-parser');

// Import OpenAI configuration and API client
const { Configuration, OpenAIApi } = require('openai');

// Import dotenv to manage environment variables
require('dotenv').config();

// server.js

// Create an instance of the Express application
const app = express();

// Define the port on which the server will listen
const port = 3000;

// Use CORS middleware to allow cross-origin requests
app.use(cors());

// Use Body-Parser middleware to parse JSON request bodies
app.use(bodyParser.json());

// Set up OpenAI API configuration with the API key from the environment variable
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  
  // Create an instance of the OpenAI API client
  const openai = new OpenAIApi(configuration);

  // Serve static files from the current directory
app.use(express.static(__dirname));

// Define an API endpoint to handle POST requests at /api/prompt
app.post('/api/prompt', async (req, res) => {
    // Extract the prompt from the request body
    const { prompt } = req.body;
  
    try {
      // Send the prompt to the OpenAI API and get the completion
      const completion = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo', // You can use 'gpt-4' if you have access
        messages: [{ role: 'user', content: prompt }],
      });
  
      // Send the AI's response back to the client
      res.json({ response: completion.data.choices[0].message.content });
    } catch (error) {
      // Log the error for debugging purposes
      console.error(error.response ? error.response.data : error.message);
  
      // Send a 500 Internal Server Error response
      res.status(500).send('Something went wrong!');
    }
  });

  // Start the server and listen on the specified port
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });

openai.listModels()
  .then(response => console.log(response.data))
  .catch(error => console.error(error));