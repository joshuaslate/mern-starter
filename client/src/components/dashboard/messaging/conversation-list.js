import React, { Component } from 'react';
import cookie from 'react-cookie';
const moment = require('moment');

import ConversationItem from './conversation-item';

class ConversationList extends Component {
  constructor(props) {
    super(props);

    this.userCookie = cookie.load('user');
  }

  render() {
    const currentUser = this.userCookie._id;

    return (
      <div className="messages">
        {this.props.conversations.map(data => data.map(message => (
          <ConversationItem
            key={message._id}
            message={message.body}
            authorId={message.author._id}
            conversationId={message.conversationId}
            author={`${message.author.profile.firstName} ${message.author.profile.lastName.substring(0, 1)}.`}
            timestamp={moment(message.createdAt).from(moment())}
          />
            )))}
      </div>
    );
  }
}

export default ConversationList;
