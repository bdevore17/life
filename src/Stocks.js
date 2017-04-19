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
      stocks: [],
      deleteEnabled: false
    };
    this.count = 0;
    this.getStocks();
    this.fetches = setInterval(this.getStocks, 5000);
  }

  fetchStock = s => {
    let url = '/api/stock';
    $.ajax({
      url: url,
      data: {
        symbol: s.symbol
      },
      type: 'GET',
      success: stock => {
        let temp = this.state.stocks;
        Object.assign(s, stock);
        this.setState({ stocks: temp });
      },
      error: (xhr, status, err) => {
        console.error(url, status, err.toString());
      }
    });
  };

  getStocks = () => {
    for (let i = 0; i < this.state.stocks.length; i++) {
      this.fetchStock(this.state.stocks[i]);
    }
  };

  addStock = (name, symbol) => {
    let stock = {
      name: name,
      symbol: symbol,
      key: this.count++,
      selected: false
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

  handleRowSelection = selectedRows => {
    let stocks = this.state.stocks.slice();
    if (selectedRows === 'all') {
      let arr = [];
      for (let i = 0; i < this.state.stocks.length; i++) {
        arr[i] = i;
      }
      selectedRows = arr;
    } else if (selectedRows === 'none') {
      selectedRows = [];
    }
    for (let i = 0; i < stocks.length; i++) {
      stocks[i].selected = selectedRows.includes(i);
    }
    this.setState({ stocks: stocks, deleteEnabled: selectedRows.length > 0 });
  };

  deleteSelectedStocks = () => {
    let newStocks = this.state.stocks.filter(stock => {
      return !stock.selected;
    });
    this.setState({ stocks: newStocks, deleteEnabled: false });
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
        <TableRow key={index} selected={stock.selected}>
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
        <StockToolbar
          addStock={this.addStock}
          sortStocks={this.sortStocks}
          deleteStockEnabled={this.state.deleteEnabled}
          onDelete={this.deleteSelectedStocks}
        />
        <Table
          multiSelectable
          fixedHeader
          onRowSelection={this.handleRowSelection}
        >
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
          <TableBody
            deselectOnClickaway={false}
            showRowHover={true}
            key={this.count++}
          >
            {/*remove the key above when the select bug is fixed, issue #6006 in material-ui --!>*/}
            {rows}
          </TableBody>
        </Table>
      </div>
    );
  }
}

export default Stocks;
