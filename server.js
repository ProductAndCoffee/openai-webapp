const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Configuration, OpenAIApi } = require('openai');

require('dotenv').config();

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

app.use(express.static(__dirname));

app.post('/api/prompt', async (req, res) => {
    const { prompt } = req.body;

    try {
        const completion = await openai.createChatCompletion({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: prompt }],
        });

        res.json({ response: completion.data.choices[0].message.content });
    } catch (error) {
        console.error(error.response ? error.response.data : error.message);
        res.status(500).send('Something went wrong!');
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
