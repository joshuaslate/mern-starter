import React, { Component } from 'react';

import MessageItem from './message-item';

class MessageList extends Component {
  render() {
    return (
      <ul className="messages">
        {this.props.displayMessages.map(function(data) {
          return <MessageItem key={data.id} message={data.messageBody} />
        })}
      </ul>
    );
  }
}

export default MessageList;
