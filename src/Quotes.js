import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import $ from 'jquery';

class Navigation extends Component {
  constructor(props) {
    super(props);
    this.h1Style = {
      fontFamily: 'Roboto, sans-serif',
      textAlign: 'center',
      color: '#004455'
    };
    this.h2Style = {
      fontFamily: 'Roboto, sans-serif',
      width: '75%',
      padding: 10,
      margin: 'auto',
      textAlign: 'center'
    };
    this.buttonStyle = {
      textAlign: 'center',
      margin: 'auto',
      padding: 10
    };
    this.state = {
      quote: '',
      author: '',
      buttonEnabled: true
    };
  }

  fetchQuote = () => {
    this.setState({ buttonEnabled: false });
    let url = 'api/quote';
    $.ajax({
      url: url,
      type: 'GET',
      success: response => {
        this.setState({
          quote: response.quote,
          author: '- '.concat(response.author),
          buttonEnabled: true
        });
      },
      error: (xhr, status, err) => {
        this.setState({ buttonEnabled: true });
        console.error(url, status, err.toString());
      }
    });
  };

  render() {
    return (
      <div>
        <h1 style={this.h1Style}>
          Get Your Daily Quote!
        </h1>
        <h3 style={this.h2Style}>
          {this.state.quote}
          <br /> <br />
          <div style={{ fontStyle: 'italic' }}>
            {this.state.author}
          </div>
        </h3>
        <div style={this.buttonStyle}>
          <RaisedButton
            label="Quote Me!"
            secondary={true}
            onTouchTap={this.fetchQuote}
            disabled={!this.state.buttonEnabled}
          />
        </div>
      </div>
    );
  }
}

export default Navigation;
