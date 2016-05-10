import React, { Component } from 'react';
import { reduxForm } from 'redux-form';
import * as actions from '../../actions';

class ContactForm extends Component {
  static contextTypes = {
    router: React.PropTypes.object
  }

  componentWillMount() {
    this.props.clearErrors();
  }

  handleFormSubmit({ firstName, lastName, subject, message }) {
    this.props.sendContactForm({ firstName, lastName, subject, message });
  }

  renderAlert() {
    if (this.props.errorMessage) {
      return (
        <div className="alert alert-danger">
          <strong>Oops!</strong> {this.props.errorMessage}
        </div>
      )
    }
  }

  renderMessage() {
    if (this.props.message) {
      return (
        <div className="alert alert-success">
          <strong>Success!</strong> {this.props.message}
        </div>
      )
    }
  }

  render() {
    const { handleSubmit, fields: { firstName, lastName, subject, message } } = this.props;

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
            <label>Subject</label>
            <input {...subject} className="form-control" />
          </fieldset>
        </div>
      </div>

      <div className="row">
        <div className="col-md-12">
          <fieldset className="form-group">
            <label>Message</label>
            <textarea {...firstName} className="form-control" />
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
  return { errorMessage: state.auth.error, message: state.auth.message };
}

export default reduxForm({
  form: 'contactForm',
  fields: ['firstName', 'lastName', 'subject', 'message']
}, mapStateToProps, actions)(ContactForm);
