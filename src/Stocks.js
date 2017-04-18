import React, { Component } from 'react';
import StockToolbar from './StockToolbar';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn
} from 'material-ui/Table';
import $ from 'jquery';

class Stocks extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stocks: []
    };
    this.getStocks();
    this.fetches = setInterval(this.getStocks, 5000);
  }

  fetchStock = index => {
    let url = '/api/stock';
    $.ajax({
      url: url,
      data: {
        symbol: this.state.stocks[index].symbol
      },
      type: 'GET',
      success: stock => {
        stock.symbol = this.state.stocks[index].symbol;
        stock.name = this.state.stocks[index].name;
        let temp = this.state.stocks;
        if (temp[index].symbol === this.state.stocks[index].symbol) {
          temp[index] = stock;
          this.setState({ stocks: temp });
        }
      },
      error: (xhr, status, err) => {
        console.error(url, status, err.toString());
      }
    });
  };

  getStocks = () => {
    for (let i = 0; i < this.state.stocks.length; i++) {
      this.fetchStock(i);
    }
  };

  addStock = (name, symbol) => {
    let stock = {
      name: name,
      symbol: symbol
    };
    this.setState(
      {
        stocks: this.state.stocks.concat([stock])
      },
      () => this.getStocks()
    );
  };

  componentWillUnmount() {
    clearInterval(this.fetches);
  }

  render() {
    let rows = this.state.stocks.map((stock, index) => {
      let diff = stock.currentPrice - stock.previousClose;
      let prefix = '+';
      if (diff < 0) {
        prefix = '-';
        diff *= -1;
      }
      let prices = stock.dayOpenPrice && stock.currentPrice && stock.previousClose;
      return (
        <TableRow key={index}>
          <TableRowColumn>{stock.name}</TableRowColumn>
          <TableRowColumn>{stock.symbol}</TableRowColumn>
          <TableRowColumn>
            {prices ? `\$${stock.previousClose.toFixed(2)}` : ''}
          </TableRowColumn>
          <TableRowColumn>
            {prices ? `\$${stock.dayOpenPrice.toFixed(2)}` : ''}
          </TableRowColumn>
          <TableRowColumn>
            {prices ? `\$${stock.currentPrice.toFixed(2)}` : ''}
          </TableRowColumn>
          <TableRowColumn>
            {prices ? `${prefix}\$${diff.toFixed(2)}` : ''}
          </TableRowColumn>
          <TableRowColumn>
            {prices
              ? `${prefix}${(diff / stock.previousClose * 100).toFixed(2)}%`
              : ''}
          </TableRowColumn>
        </TableRow>
      );
    });
    // let articleCards = this.state.articles.map((article, index) => {
    // return (
    //   <Widget
    //   title={article.title}
    //   media={<img src={article.image}/>}
    //   description={article.description}
    //   key={index}
    //   onMediaTap={() => window.open(article.url,'_blank')}
    //   />
    // );
    // });

    // return (
    //   <div>
    //     <AutoComplete
    //       hintText="Add Stock Symbol Here"
    //       dataSource={this.state.dataSource}
    //       onUpdateInput={this.handleAutoFill}
    //       filter={AutoComplete.fuzzyFilter}
    //       floatingLabelText="Add Stock"
    //     />
    //   {articleCards}
    //   </div>
    // );

    return (
      <div>
        <StockToolbar addStock={this.addStock} />
        <Table>
          <TableHeader>
            <TableRow>
              <TableHeaderColumn>Name</TableHeaderColumn>
              <TableHeaderColumn>Symbol</TableHeaderColumn>
              <TableHeaderColumn>Previous Close</TableHeaderColumn>
              <TableHeaderColumn>Day Open</TableHeaderColumn>
              <TableHeaderColumn>Current</TableHeaderColumn>
              <TableHeaderColumn>Change</TableHeaderColumn>
              <TableHeaderColumn>% Change</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows}
          </TableBody>
        </Table>
      </div>
    );
  }
}

export default Stocks;
