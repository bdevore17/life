import React, { Component } from 'react';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import NavigationExpandMoreIcon
  from 'material-ui/svg-icons/navigation/expand-more';
import MenuItem from 'material-ui/MenuItem';
import DropDownMenu from 'material-ui/DropDownMenu';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import AutoComplete from 'material-ui/AutoComplete';
import FlatButton from 'material-ui/FlatButton';
import $ from 'jquery';
import { Toolbar, ToolbarGroup } from 'material-ui/Toolbar';
import comparisons from './helpers/stockComparison'

class StockToolbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0,
      stocks: [],
      dataSource: [],
      openDialog: false,
      validInput: false,
      deleteEnabled: false
    };
    this.exchanges = ['NYSE', 'NASDAQ', 'AMEX'];
    this.sortOptions = [
      'Added First',
      'Added Last',
      'Alphabetically',
      'Previous Close',
      'Day Open',
      'Current Price',
      'Gainers',
      'Losers'
    ].map((option, key) => {
      return (
        <MenuItem
          key={key}
          value={key}
          label={`Order By: ${option}`}
          primaryText={option}
        />
      );
    });
  }

  setDataSource = suggestions => {
    let ds = JSON.parse(suggestions).ResultSet.Result.filter(sug => {
      return sug.type === 'S' && this.exchanges.includes(sug.exchDisp);
    });
    ds = ds.map(sug => {
      return `${sug.name} (${sug.symbol})`;
    });
    this.setState({ dataSource: ds });
  };

  handleAutoFill = input => {
    this.setState({ validInput: this.state.dataSource.includes(input) });
    this.input = input;
    let url = '/api/stock/autofill';
    $.ajax({
      url: url,
      type: 'GET',
      data: {
        input: input
      },
      success: suggestions => {
        this.setDataSource(suggestions);
      },
      error: (xhr, status, err) => {
        console.error(url, status, err.toString());
      }
    });
  };

  handleChange = (event, index, value) => {
    this.setState({ value });
    switch (index) {
      case 0:
        this.props.sortStocks(comparisons.addedFirst);
        return;
      case 1:
        this.props.sortStocks(comparisons.addedLast);
        return;
      case 2:
        this.props.sortStocks(comparisons.alphabetical);
        return;
      case 3:
        this.props.sortStocks(comparisons.previousClose);
        return;
      case 4:
        this.props.sortStocks(comparisons.dayOpen);
        return;
      case 5:
        this.props.sortStocks(comparisons.currentPrice);
        return;
      case 6:
        this.props.sortStocks(comparisons.gainers);
        return;
      case 7:
        this.props.sortStocks(comparisons.losers);
        return;
      default:
        return;
    }
  };

  handleSubmit = () => {
    this.setState({ openDialog: false });
    const firstParens = this.input.lastIndexOf('(');
    const lastParens = this.input.lastIndexOf(')');
    const symbol = this.input.slice(firstParens + 1, lastParens);
    const name = this.input.slice(0, firstParens - 1);
    this.props.addStock(name, symbol);
  };

  dialog = () => {
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={() => this.setState({ openDialog: false })}
      />,
      <FlatButton
        label="Submit"
        primary={true}
        disabled={!this.state.validInput}
        onTouchTap={this.handleSubmit}
      />
    ];

    return (
      <Dialog
        title="Add a Stock"
        actions={actions}
        modal={true}
        open={this.state.openDialog}
      >
        <AutoComplete
          hintText="Add Stock Symbol Here"
          dataSource={this.state.dataSource}
          onUpdateInput={this.handleAutoFill}
          filter={AutoComplete.fuzzyFilter}
          floatingLabelText="Add Stock"
          fullWidth={true}
        />
      </Dialog>
    );
  };

  render() {
    return (
      <div>
        <Toolbar>
          <ToolbarGroup firstChild={true}>
            <DropDownMenu
              value={this.state.value}
              onChange={this.handleChange}
              iconStyle={{ fill: 'black' }}
            >
              {this.sortOptions}
            </DropDownMenu>
          </ToolbarGroup>
          <ToolbarGroup>
            <RaisedButton
              label="Add"
              primary={true}
              onTouchTap={() => this.setState({ openDialog: true })}
            />
            <RaisedButton
              label="Delete"
              secondary={true}
              // labelColor="#FFFFFF"
              // backgroundColor="#FF0000"
              disabledBackgroundColor="#d3d3d3"
              disabled={!this.props.deleteStockEnabled}
              onTouchTap={this.props.onDelete}
            />
            <IconMenu
              iconButtonElement={
                <IconButton touch={true}>
                  <NavigationExpandMoreIcon />
                </IconButton>
              }
            >
              <MenuItem primaryText="Download" />
              <MenuItem primaryText="More Info" />
            </IconMenu>
          </ToolbarGroup>
        </Toolbar>
        {this.dialog()}
      </div>
    );
  }
}

export default StockToolbar;
