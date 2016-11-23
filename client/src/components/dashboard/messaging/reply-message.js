import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { sendReply } from '../../../actions/messaging';

const form = reduxForm({
  form: 'replyMessage',
});

const renderField = field => (
  <div>
    <input className="form-control" autoComplete="off" {...field.input} />
  </div>
);

class ReplyMessage extends Component {
  handleFormSubmit(formProps) {
    this.props.sendReply(this.props.replyTo, formProps);
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
        {this.renderAlert()}
        <Field name="composedMessage" className="form-control" component={renderField} type="text" placeholder="Type here to chat..." />
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

export default connect(mapStateToProps, { sendReply })(form(ReplyMessage));
