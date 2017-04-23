import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
import Navigation from './Navigation';
import './App.css'
import News from './News';
import Stocks from './Stocks'
import Quotes from './Quotes'

class App extends Component {

   constructor(props) {
    super(props);
    this.items = ['Home', 'News', 'Stocks', 'Weather', 'Quotables'];
    this.state = {
      index: 4
    };
  }

  handleMainBody = () => {
    switch(this.state.index) {
      case 0:
        return;
      case 1:
        return <News/>;
      case 2:
        return <Stocks/>;
      case 3:
        return;
      case 4:
        return <Quotes/>;
      default:
        return;
    }
  }

  render() {
    let title = 'Life';
    if (this.state.index > 0) {
      title += `: ${this.items[this.state.index]}`;
    }

    return (
      <MuiThemeProvider>
        <div className="App">
          <Navigation
            title={title}
            handleMenuItem={ index => {this.setState({index})}}
            items={this.items}
            index={this.state.index}
          />
        {this.handleMainBody()}

        </div>
      </MuiThemeProvider>
    );
  }
}

injectTapEventPlugin();
export default App;