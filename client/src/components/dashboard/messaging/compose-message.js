import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { fetchRecipients, startConversation } from '../../../actions/messaging';

const form = reduxForm({
  form: 'composeMessage',
  validate,
});

function validate(formProps) {
  const errors = {};

  if (!formProps.composedMessage) {
    errors.password = 'Please enter a message';
  }

  return errors;
}

const renderField = field => (
  <div>
    <input className="form-control" autoComplete="off" {...field.input} />
    {field.touched && field.error && <div className="error">{field.error}</div>}
  </div>
);

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

  renderAlert() {
    if (this.props.errorMessage) {
      return (
        <div className="alert alert-danger">
          <strong>Oops!</strong> {this.props.errorMessage}
        </div>
      );
    } else if (this.props.message) {
      return (
        <div className="alert alert-success">
          <strong>Success!</strong> {this.props.message}
        </div>
      );
    }
  }

  render() {
    const { handleSubmit } = this.props;

    return (
      <form onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}>
        <h2>Start New Conversation</h2>
        <Field className="form-control" name="recipient" component="select">
          <option />
          {this.renderRecipients()}
        </Field>

        <label>Enter your message below</label>
        {this.renderAlert()}
        <Field name="composedMessage" component={renderField} type="text" placeholder="Type here to chat..." />
        <button action="submit" className="btn btn-primary">Send</button>
      </form>
    );
  }
}

function mapStateToProps(state) {
  return {
    recipients: state.communication.recipients,
    errorMessage: state.communication.error,
  };
}

export default connect(mapStateToProps, { fetchRecipients, startConversation })(form(ComposeMessage));
