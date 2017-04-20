const request = require('request');

class Stock {
  constructor(symbol) {
    this.symbol = symbol;
  }

  getData(callback) {
    if (this.data) {
      callback(undefined, this.data)
    }
    else {
      this.fetchPrice(callback);
    }
  }


  fetchPrice(callback) {
    let url = 'http://finance.yahoo.com/d/quotes.csv?s=';
    let tags = '&f=l1op';

    let options = {
      url: url.concat(this.symbol.concat(tags)),
    };
    request(options, (error, response, body) => {
      if (!error) {
        let prices = body.trim().split(',');
        this.data = {
          symbol: this.symbol,
          currentPrice: parseFloat(prices[0]),
          dayOpenPrice: parseFloat(prices[1]),
          previousClose: parseFloat(prices[2])
        };
        callback(undefined, this.data);
      }
      else {
        console.log(error);
        callback(new Error(error));
      }
    });
  }
}

module.exports = Stock;