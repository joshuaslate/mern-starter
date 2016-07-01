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
        {this.props.conversations.map(function(data) {
          return <ConversationItem key={data._id}
          message={data.lastMessage.excerpt}
          authorId={data.lastMessage.author._id}
          conversationPartner={data.participants[0]._id !== currentUser ? data.participants[0] : data.participants[1]}
          conversationId={data._id}
          author={data.lastMessage.author.profile.firstName + ' ' + data.lastMessage.author.profile.lastName.substring(0,1) + '.'}
          timestamp={moment(data.updatedAt).from(moment())} />
        })}
      </div>
    );
  }
}

export default ConversationList;
