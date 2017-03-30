import React, { Component } from 'react';
import {Card, CardTitle, CardMedia, CardText} from 'material-ui/Card';

class Widget extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.style = {
      // position: 'relative',
      width: '400px',
      // height: '400px',
      display: 'inline-flex',
      margin: (10 / 7) +'%',
      textAlign: 'center',
    };
  }

  render() {
    return (
      <Card style={this.style}>
          <CardMedia
            overlay={<CardTitle title={this.props.title}/>}
            onTouchTap={this.props.onMediaTap}
            style={{cursor: 'pointer'}}
          >
            {this.props.media}
          </CardMedia>
        <CardText>
          {this.props.description}
        </CardText>
      </Card>
    );
  }
}

export default Widget;