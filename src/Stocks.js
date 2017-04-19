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
    this.count = 0;
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
        let temp = this.state.stocks;
        if (temp[index].symbol === this.state.stocks[index].symbol) {
          Object.assign(temp[index], stock);
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
      symbol: symbol,
      key: this.count++
    };
    this.setState(
      {
        stocks: this.state.stocks.concat([stock])
      },
      () => this.getStocks()
    );
  };

  sortStocks = compareFunction => {
    let stocks = this.state.stocks;
    stocks.sort(compareFunction);
    this.setState({ stocks: stocks });
  };

  componentWillUnmount() {
    clearInterval(this.fetches);
  }

  render() {
    let rows = this.state.stocks.map((stock, index) => {
      let diff = stock.currentPrice - stock.previousClose;
      let prefix = '+';
      let color = '#21bf21';
      if (diff < 0) {
        prefix = '-';
        diff *= -1;
        color = '#FF0000';
      }
      let prices =
        stock.dayOpenPrice && stock.currentPrice && stock.previousClose;
      return (
        <TableRow key={index}>
          <TableRowColumn>{stock.name}</TableRowColumn>
          <TableRowColumn>{stock.symbol}</TableRowColumn>
          <TableRowColumn>
            {prices ? `$${stock.previousClose.toFixed(2)}` : ''}
          </TableRowColumn>
          <TableRowColumn>
            {prices ? `$${stock.dayOpenPrice.toFixed(2)}` : ''}
          </TableRowColumn>
          <TableRowColumn>
            {prices ? `$${stock.currentPrice.toFixed(2)}` : ''}
          </TableRowColumn>
          <TableRowColumn style={{ color: color }}>
            {prices ? `${prefix}$${diff.toFixed(2)}` : ''}
          </TableRowColumn>
          <TableRowColumn style={{ color: color }}>
            {prices
              ? `${prefix}${(diff / stock.previousClose * 100).toFixed(2)}%`
              : ''}
          </TableRowColumn>
        </TableRow>
      );
    });

    return (
      <div>
        <StockToolbar addStock={this.addStock} sortStocks={this.sortStocks} />
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
