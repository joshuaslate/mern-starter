import React, { Component } from 'react';
const moment = require('moment');

import MessageItem from './message-item';

class MessageList extends Component {
  render() {
    return (
      <div className="messages">
        {this.props.displayMessages.map(data => <MessageItem
          key={data._id}
          message={data.body}
          author={data.author}
          timestamp={moment(data.createdAt).from(moment())}
        />)}
      </div>
    );
  }
}

export default MessageList;
