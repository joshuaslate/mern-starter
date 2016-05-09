import React, { Component } from 'react';

class MessageItem extends Component {
  render() {
    return (
      <li className="message-list-item">{this.props.message}</li>
    );
  }
}

export default MessageItem;
