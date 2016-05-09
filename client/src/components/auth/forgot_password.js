import React, { Component } from 'react';
import { reduxForm } from 'redux-form';
import * as actions from '../../actions';

class ForgotPassword extends Component {
  static contextTypes = {
    router: React.PropTypes.object
  }

  componentWillMount() {
    if(this.props.authenticated) {
      this.context.router.push('/dashboard');
    }
  }

  componentWillUpdate(nextProps) {
    if(nextProps.authenticated) {
      this.context.router.push('/dashboard');
    }
  }

  handleFormSubmit({ email }) {
    this.props.getForgotPasswordToken({ email });
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

  render() {
    const { handleSubmit, fields: { email } } = this.props;

    return (
      <form onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}>
        <fieldset className="form-group">
          <label>Email:</label>
          <input {...email} className="form-control" />
        </fieldset>

        {this.renderAlert()}
        <button action="submit" className="btn btn-primary">Reset Password</button>
      </form>
    );
  }
}

function mapStateToProps(state) {
  return { errorMessage: state.auth.error };
}

export default reduxForm({
  form: 'forgot_password',
  fields: ['email']
}, mapStateToProps, actions)(ForgotPassword);
