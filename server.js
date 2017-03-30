require('dotenv').config()
const express = require('express');
const morgan = require('morgan');
const path = require('path');
const News = require('./lib/news');

const app = express();

// Setup logger
app.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] :response-time ms'));

// Serve static assets
app.use(express.static(path.resolve(__dirname, '.', 'build')));

app.get('/api/news', (request, response) => {
  let news = new News(process.env.NEWS_KEY);
  news.getData((err, articles) => {
    if (!err) {
      response.json(articles);
    }
  });
});

// Always return the main index.html, so react-router render the route in the client
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '.', 'build', 'index.html'));
});

app.listen(process.env.PORT || 4000, () => {
  console.log(`App listening on port ${process.env.PORT || 4000}`);
});