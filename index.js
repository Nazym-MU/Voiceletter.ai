// Import necessary libraries and packages
import express from "express";
import pg from "pg";
import 'dotenv/config'; // Environment variables
import axios from 'axios';

// Initializing Express app
const app = express();
const port = process.env.PORT || 3000; // Default port is 3000

// Set up PostgreSQL client with environment variable configurations
const db = new pg.Client({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Connect to the PostgreSQL database
db.connect();

// Middleware to parse URL-encoded data and JSON data
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public")); // Serve static files from the 'public' directory
app.use(express.json());

// Function to fetch news by ID from the database
async function fetchNewsById(newsId) {
  try {
    const result = await db.query('SELECT * FROM news WHERE id = $1', [newsId]);
    return result.rows[0];
  } catch (error) {
    console.error(error);
  }
}

// Function to fetch news from the Bing News Search API
async function fetchNews(query) {
  const endpoint = 'https://api.bing.microsoft.com/v7.0/news/search';
  const params = {
      q: query,
      mkt: 'en-US',
      freshness: 'Day'
  };

  try {
      const response = await axios.get(endpoint, {
          params: params,
          headers: {
              'Ocp-Apim-Subscription-Key': process.env.BING_NEWS_API_KEY
          }
      });

      // Extracting news content from the API response
      const newsContent = response.data.value.map(article => `${article.name}\n${article.description}\n`).join('\n\n');
      return newsContent;
  } catch (error) {
      console.error('Error fetching news:', error.message);
      throw error;
  }
}

// Function to synthesize speech from text using OpenAI's API
async function synthesizeSpeech(text) {
  const endpoint = 'https://api.openai.com/v1/audio/speech';
  const body = {
      model: 'tts-1',
      voice: 'alloy',
      input: text
  };

  try {
      const response = await axios.post(endpoint, body, {
          responseType: 'stream',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
          }
      });

      return response.data; // Returns the audio stream
  } catch (error) {
      console.error('Error synthesizing speech:', error.message);
      throw error;
  }
}

// Function to summarize news content using GPT-3.5 of OpenAI
async function summarizeNews(text) {
  const endpoint = 'https://api.openai.com/v1/chat/completions';
  const body = {
      model: 'gpt-3.5-turbo',
      messages: [
          { role: "user", content: "You are a news presenter. Provide a comprehensive summary of this news. Include all key details: " + text }
      ],
      temperature: 0.7
  };

  try {
      const response = await axios.post(endpoint, body, {
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
          }
      });

      return response.data.choices[0].message.content; 
  } catch (error) {
      console.error('Error summarizing news:', error.message);
      throw error;
  }
}

// Route handlers
app.get('/', async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM news");
    const newsList = result.rows;
    res.render('index.ejs', { newsList });
  } catch (error) {
      console.error(error);
      res.status(500).send('Error fetching news');
  }
});

app.post("/query", async (req, res) => {
  const query = req.body.title;
  try {
      const content = await fetchNews(query);
      const summary = await summarizeNews(content);
      await db.query('INSERT INTO news (title, content) VALUES ($1, $2)', [query, summary]);
      res.redirect("/");
  } catch (error) {
      console.error('Error processing the news query:', error);
      res.status(500).send('Failed to process news query');
  }
});

app.get('/synthesize/:id', async (req, res) => {
  const newsId = req.params.id;
  try {
      const news = await fetchNewsById(newsId);
      const audioStream = await synthesizeSpeech(news.content);
      res.setHeader('Content-Type', 'audio/mpeg');
      audioStream.pipe(res); // Streaming the audio response
  } catch (error) {
      console.error('Error synthesizing speech:', error);
      res.status(500).send('Failed to synthesize speech');
  }
});

app.get("/delete/:id", async (req, res) => {
  const newsId = req.params.id;
  try {
      await db.query('DELETE FROM news WHERE id = $1', [newsId]);
      res.redirect('/');
  } catch (error) {
      console.error('Error deleting news:', error);
      res.status(500).send('Error deleting news');
  }
});

// Starting the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
