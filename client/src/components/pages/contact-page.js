import React, { Component } from 'react';
import { reduxForm } from 'redux-form';
import { sendContactForm } from '../../actions/index';

class ContactPage extends Component {
  handleFormSubmit({ firstName, lastName, emailAddress, subject, message }) {
    this.props.sendContactForm({ firstName, lastName, emailAddress, subject, message });
  }

  renderAlert() {
    if (this.props.errorMessage) {
      return (
        <div className="alert alert-danger">
          <strong>Oops!</strong> {this.props.errorMessage}
        </div>
      );
    }
  }

  renderMessage() {
    if (this.props.message) {
      return (
        <div className="alert alert-success">
          <strong>Success!</strong> {this.props.message}
        </div>
      );
    }
  }

  render() {
    const { handleSubmit, fields: { firstName, lastName, emailAddress, subject, message } } = this.props;

    return (
      <form onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}>
        {this.renderMessage()}
        <div className="row">
          <div className="col-md-6">
            <fieldset className="form-group">
              <label>First Name</label>
              <input {...firstName} className="form-control" />
            </fieldset>
          </div>

          <div className="col-md-6">
            <fieldset className="form-group">
              <label>Last Name</label>
              <input {...lastName} className="form-control" />
            </fieldset>
          </div>
        </div>

        <div className="row">
          <div className="col-md-12">
            <fieldset className="form-group">
              <label>Email Address</label>
              <input {...emailAddress} className="form-control" />
            </fieldset>
          </div>
        </div>

        <div className="row">
          <div className="col-md-12">
            <fieldset className="form-group">
              <label>Subject</label>
              <input {...subject} className="form-control" />
            </fieldset>
          </div>
        </div>

        <div className="row">
          <div className="col-md-12">
            <fieldset className="form-group">
              <label>Message</label>
              <textarea {...message} className="form-control" />
            </fieldset>
          </div>
        </div>
        {this.renderAlert()}
        <button action="submit" className="btn btn-primary">Send</button>
      </form>
    );
  }
}

function mapStateToProps(state) {
  return { errorMessage: state.communication.error,
    message: state.communication.message,
    authenticated: state.auth.authenticated };
}

export default reduxForm({
  form: 'contactForm',
  fields: ['firstName', 'lastName', 'emailAddress', 'subject', 'message'],
}, mapStateToProps, { sendContactForm })(ContactPage);
