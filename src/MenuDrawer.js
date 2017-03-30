import React, { Component } from 'react';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';

class MenuDrawer extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleMenuTap = (index) => {
    this.props.toggleOpen();
    this.props.handleMenuItem(index);
  }

  menuItems = () => {
    return this.props.items.map((item, index) => {
      return (
        <MenuItem
          onTouchTap={() => this.handleMenuTap(index)}
          key={index}
          focusState={index === this.props.index ? 'focused' : 'none'}
        >
          {item}
        </MenuItem>
      );
    });
  }

  render() {
    return (
      <Drawer
        docked={false}
        open={this.props.open}
        onRequestChange={this.props.toggleOpen}
      >
      {this.menuItems()}
      </Drawer>
    );
  }
}

export default MenuDrawer;