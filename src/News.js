import React, { Component } from 'react';
import Widget from './Widget';
import $ from 'jquery';

class News extends Component {
  constructor(props) {
    super(props);
    this.state = {
      articles: []
    };
    this.getArticles();
  }

  getArticles = () => {
    let url = '/api/news';
    $.ajax({
      url: url,
      type: 'GET',
      success: (articles) => {
        this.setState({articles: articles});
      },
      error: (xhr, status, err) => {
        console.error(url, status, err.toString());
      }
    });
  }

  // componentWillUnmount() {
  //   clearInterval(this.fetches);
  // }

  render() {
    let articleCards = this.state.articles.map((article, index) => {
      return (
        <Widget
        title={article.title}
        media={<img src={article.image}/>}
        description={article.description}
        key={index}
        onMediaTap={() => window.open(article.url,'_blank')}
        />
      );
    });

    return (
      <div>
      {articleCards}
      </div>
    );
  }
}

export default News;