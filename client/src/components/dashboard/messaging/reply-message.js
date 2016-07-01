import React, { Component } from 'react';
import { reduxForm } from 'redux-form';
import * as actions from '../../../actions/index';

class ReplyMessage extends Component {
  handleFormSubmit(formProps) {
    this.props.sendReply(this.props.replyTo, formProps);
  }

  render() {
    const { handleSubmit, fields: { composedMessage } } = this.props;

    return (
      <form onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}>
        <input
        type="text"
        autoComplete="off"
        className="form-control"
        placeholder="Type here to chat..."
        {...composedMessage} />
        <button action="submit" className="btn btn-primary">Send</button>
      </form>
    );
  }
}

export default reduxForm({
  form: 'replyMessage',
  fields: ['composedMessage']
}, null, actions)(ReplyMessage);
