import React, { Component } from 'react';

class ConversationItem extends Component {
  render() {
    return (
      <div className={this.props.conversationPartner._id == this.props.authorId ? "message" : "message current-user"}>
        <a href={`/dashboard/conversation/view/${this.props.conversationId}`}>
        <span>Conversation with {this.props.conversationPartner.profile.firstName} {this.props.conversationPartner.profile.lastName}</span><br />
          <span className="message-body">{this.props.message}</span>
          <br />
          <span className="message-byline">From {this.props.author} | {this.props.timestamp}</span>
        </a>
      </div>
    );
  }
}

export default ConversationItem;
