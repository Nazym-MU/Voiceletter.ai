# Voiceletter.ai

## Description

Voiceletter.ai is a web application built with Node.js and Express that allows users to query news articles, automatically summarize them, and manage these summaries in a database. It integrates external APIs for news fetching and text synthesis, enhancing the user experience by providing synthesized voice outputs of news summaries. It's a web version of the iOS app I developed during the nFactorial 2024 hackathon. 

## Problem Description

Today, staying updated with the latest news is essential but it takes a lot of time to search, read, evaluate, and process it. 

## Solution

Voiceletter.ai addresses these challenges by providing:

- **Efficient Summarization**: It quickly transforms the news articles related to your query from the past 24 hours into concise summaries, enabling users to understand the key points in a fraction of the time.
- **Audio Synthesis**: Converts text summaries into audio, making news accessible and convenient, particularly for visually impaired users or those on the move.

This tool utilizes advanced AI technologies to streamline news consumption, making it more accessible and efficient for everyone.


## Features

- **News Fetching:** Query news from the Bing News API based on user input.
- **News Summarization:** Automatically summarize news articles using the OpenAI API.
- **Audio Synthesis:** Convert text summaries into speech for auditory consumption.
- **Operations:** Create, read, and delete news summaries in a PostgreSQL database.
- **Responsive Web Interface:** Manage and interact with news data through a user-friendly web interface.

## Video Walkthrough

[YouTube Link][https://youtu.be/0Y_dk_SRzt0]

## Technologies Used

- Node.js: Server-side JavaScript runtime environment.
- Express.js: Web application framework for Node.js.
- Axios: Promise-based HTTP client for the browser and node.js.
- EJS (Embedded JavaScript) templating engine
- PostgreSQL: Open source relational database.
- OpenAI API: Summarization of the news
- Bing News Search API
- Copilot: AI assistant

## Installation

Follow these steps to get your development environment set up:

1. **Clone the repository**
git clone https://github.com/Nazym-MU/Voiceletter.ai.git
cd Voiceletter.ai

2. **Install Dependencies**
npm install

3. **Set up the table**
Check setup.sql file for setting up the table in your database. There is 1 table in this project.

4. **Configure Environment Variables**
Create a `.env` file in the root directory and provide the necessary API keys and database configuration:

DB_HOST=localhost
DB_USER=myuser
DB_DATABASE=mydatabase
DB_PASSWORD=mypassword
DB_PORT=5432
BING_NEWS_API_KEY=your_bing_api_key
OPENAI_API_KEY=your_openai_api_key

5. **Start the Application**
node index.js
Access the application through `http://localhost:3000` in your web browser.

## API Endpoints

- **POST `/query`**: Submit a query to fetch and summarize news.
- **GET `/synthesize/:id`**: Retrieve synthesized speech of a news summary by ID.
- **GET `/delete/:id`**: Delete a specific news summary.