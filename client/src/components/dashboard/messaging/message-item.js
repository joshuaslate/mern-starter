import React, { Component } from 'react';
import cookie from 'react-cookie';

const currentUser = cookie.load('user');

class MessageItem extends Component {
  render() {
    return (
      <div className={currentUser == this.props.author._id ? 'message current-user' : 'message'}>
        <span className="message-body">{this.props.message}</span>
        <br />
        <span className="message-byline">From {this.props.author.profile.firstName} {this.props.author.profile.lastName} | {this.props.timestamp}</span>
      </div>
    );
  }
}

export default MessageItem;
