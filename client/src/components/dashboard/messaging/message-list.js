import React, { Component } from 'react';
const moment = require('moment');

import MessageItem from './message-item';

class MessageList extends Component {
  render() {
    return (
      <div className="messages">
        {this.props.displayMessages.map(function(data) {
          return data.messages.map(function(data) {
            return <MessageItem
            key={data._id}
            message={data.messageBody}
            author={data.from}
            timestamp={moment(data.createdAt).from(moment())} />
          })
        })}
      </div>
    );
  }
}

export default MessageList;
