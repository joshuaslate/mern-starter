import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import * as actions from '../../../actions/messaging';

import MessageList from './message-list';
import ReplyMessage from './reply-message';

const socket = actions.socket;

class Conversation extends Component {
  constructor(props) {
    super(props);

    const { params, fetchConversation } = this.props;
    // Fetch conversation thread (messages to/from user)
    fetchConversation(params.conversationId);
    socket.emit('enter conversation', params.conversationId);

    // Listen for refresh messages from socket server
    socket.on('refresh messages', (data) => {
      fetchConversation(params.conversationId);
    });
  }

  componentWillUnmount() {
    socket.emit('leave conversation', this.props.params.conversationId);
  }

  renderInbox() {
    if (this.props.messages) {
      return (
        <MessageList displayMessages={this.props.messages} />
      );
    }
  }

  render() {
    return (
      <div>
        <div className="panel panel-default">
          <div className="panel-body">
            <h4 className="left">Conversation with {this.props.params.conversationId}</h4>
            <Link className="right" to="/dashboard/inbox">Back to Inbox</Link>
            <div className="clearfix" />
            { this.renderInbox() }
          </div>
        </div>
        <ReplyMessage replyTo={this.props.params.conversationId} />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    messages: state.communication.messages,
  };
}

export default connect(mapStateToProps, actions)(Conversation);
