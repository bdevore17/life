import React, { Component } from 'react';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import NavigationExpandMoreIcon
  from 'material-ui/svg-icons/navigation/expand-more';
import MenuItem from 'material-ui/MenuItem';
import DropDownMenu from 'material-ui/DropDownMenu';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import AutoComplete from 'material-ui/AutoComplete';
import FlatButton from 'material-ui/FlatButton';
import $ from 'jquery';

import {
  Toolbar,
  ToolbarGroup,
  ToolbarSeparator,
  ToolbarTitle
} from 'material-ui/Toolbar';

class StockToolbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 3,
      stocks: [],
      dataSource: [],
      openDialog: false,
      validInput: false
    };
    this.exchanges = ['NYSE', 'NASDAQ', 'AMEX', 'Korea'];
  }

  setDataSource = suggestions => {
    let ds = [];
    JSON.parse(suggestions).ResultSet.Result.map(sug => {
      // console.log(sug.type, sug.exchDisp);
      if (sug.type === 'S' && this.exchanges.includes(sug.exchDisp))
        ds.push(`${sug.name} (${sug.symbol})`);
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

  handleChange = (event, index, value) => this.setState({ value });

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
            <DropDownMenu value={this.state.value} onChange={this.handleChange}>
              <MenuItem value={1} primaryText="All Broadcasts" />
              <MenuItem value={2} primaryText="All Voice" />
              <MenuItem value={3} primaryText="All Text" />
              <MenuItem value={4} primaryText="Complete Voice" />
              <MenuItem value={5} primaryText="Complete Text" />
              <MenuItem value={6} primaryText="Active Voice" />
              <MenuItem value={7} primaryText="Active Text" />
            </DropDownMenu>
          </ToolbarGroup>
          <ToolbarGroup>
            <ToolbarTitle text="Options" />
            <FontIcon className="muidocs-icon-custom-sort" />
            <ToolbarSeparator />
            <RaisedButton
              label="Add Stock"
              primary={true}
              onTouchTap={() => this.setState({ openDialog: true })}
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
