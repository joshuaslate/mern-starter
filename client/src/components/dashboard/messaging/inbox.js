import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../../actions/index';

import MessageList from './message-list';

class Inbox extends Component {
  componentWillMount() {
    // Fetch inbox (messages to/from user)
    this.props.fetchMessages();
  }

  renderInbox() {
    if(this.props.messages) {
      return (
        <MessageList displayMessages={this.props.messages} />
      );
    }
  }

  render() {
    return (
      <div>{this.renderInbox()}</div>
    );
  }
}

function mapStateToProps(state) {
  messages: state.communication.messages
}

export default connect(mapStateToProps, actions)(Inbox);
