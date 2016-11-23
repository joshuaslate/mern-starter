import React, { Component } from 'react';

class ConversationItem extends Component {
  render() {
    return (
      <div className="message">
        <a href={`/dashboard/conversation/view/${this.props.conversationId}`}>
          <span className="message-body">{this.props.message}</span>
          <br />
          <span className="message-byline">From {this.props.author} | {this.props.timestamp}</span>
        </a>
      </div>
    );
  }
}

export default ConversationItem;
