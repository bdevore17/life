import React, { Component } from 'react';
import AppBar from 'material-ui/AppBar';
import MenuDrawer from './MenuDrawer';

class Navigation extends Component {
  constructor(props) {
    super(props);
    this.styles = {
      title: {
      cursor: 'pointer'
      }
    };
    this.state = {
      drawerOpen: false
    };
  }

  handleTitleTap = () => {
    console.log("title tap");
  }

  toggleDrawer = () => {
    this.setState({drawerOpen: !this.state.drawerOpen});
  }

  render() {
    return (
      <div>
        <AppBar
          title={<span style={this.styles.title}>{this.props.title}</span>}
          onTitleTouchTap={this.handleTitleTap}
          onLeftIconButtonTouchTap={this.toggleDrawer}
        />
        <MenuDrawer
          open={this.state.drawerOpen}
          toggleOpen={this.toggleDrawer}
          index={this.props.index}
          handleMenuItem={this.props.handleMenuItem}
          items={this.props.items}
        />
      </div>
    );
  }
}

export default Navigation;