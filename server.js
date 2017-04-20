require('dotenv').config()
const express = require('express');
const morgan = require('morgan');
const path = require('path');
const News = require('./lib/news');
const Stock = require('./lib/stock')
const request = require('request');

const app = express();

// Setup logger
app.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] :response-time ms'));

// Serve static assets
app.use(express.static(path.resolve(__dirname, '.', 'build')));

app.get('/api/news', (req, res) => {
  let news = new News(process.env.NEWS_KEY);
  news.getData((err, articles) => {
    if (!err) {
      res.json(articles);
    }
  });
});

app.get('/api/stock', (req, res) => {
  let stock = new Stock(req.query.symbol);
  stock.getData((err, data) => {
    if (!err) {
      res.json(data);
    }
    else {
      res.status(500).send(err);
    }
  });
});

app.get('/api/stock/autofill', (req, res) => {
  let url = 'http://d.yimg.com/autoc.finance.yahoo.com/autoc?region=1&lang=en&query='.concat(req.query.input);
  request({url: url}, (error, response, body) => {
    if (!error) {
      res.json(body);
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