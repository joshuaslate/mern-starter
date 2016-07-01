import React, { Component } from 'react';
import { reduxForm } from 'redux-form';
import * as actions from '../../../actions/index';

class ComposeMessage extends Component {
  constructor(props) {
    super(props);

    this.props.fetchRecipients();
  }

  handleFormSubmit(formProps) {
    this.props.startConversation(formProps);
  }

  renderRecipients() {
    if (this.props.recipients) {
      return (
        this.props.recipients.map(data => <option key={data._id} value={data._id}>
        {data.profile.firstName} {data.profile.lastName}</option>)
      );
    }
  }

  render() {
    const { handleSubmit, fields: { recipient, composedMessage } } = this.props;

    return (
      <form onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}>
      <h2>Start New Conversation</h2>
        <select {...recipient}
        value={recipient.value || ''}
        className="form-control">
          <option></option>
          {this.renderRecipients()}
        </select>

        <label>Enter your message below</label>
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

function mapStateToProps(state) {
  return {
    recipients: state.communication.recipients
  }
}

export default reduxForm({
  form: 'composeMessage',
  fields: ['recipient', 'composedMessage']
}, mapStateToProps, actions)(ComposeMessage);
