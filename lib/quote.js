const request = require('request');

class Quote {

  getData(callback) {
    if (this.data) {
      callback(undefined, this.data)
    }
    else {
      this.fetchQuote(callback);
    }
  }


  fetchQuote(callback) {
    let url = 'http://api.forismatic.com/api/1.0/?method=getQuote&format=json&lang=en';

    request({url: url}, (error, response, body) => {
      if (!error) {
        body = body.replace(/\\'/g, '\'');
        body = JSON.parse(body);
        this.data = {
          quote: body.quoteText.trim(),
          author: body.quoteAuthor.trim()
        };
        callback(undefined, this.data);
      }
      else {
        callback(new Error(error));
      }
    });
  }
}

module.exports = Quote;