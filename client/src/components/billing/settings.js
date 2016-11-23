import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import * as actions from '../../actions/billing';
const moment = require('moment');

import CheckoutForm from './checkout-form';

class BillingSettings extends Component {
  constructor(props) {
    super(props);

    this.props.fetchCustomer();

    this.state = {
      cancelConfirm: false,
      changeSubscription: false,
      updateBilling: false,
      newPlan: '',
    };
  }

  handlePlanChange(e) {
    this.setState({ newPlan: e.target.value });
  }

  changePlanSubmit() {
    this.props.updateSubscription(this.state.newPlan);
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

  renderPlan() {
    if (this.props.customer.subscriptions) {
      const mostRecentSubscription = this.props.customer.subscriptions.total_count - 1;
      const mostRecentSource = this.props.customer.sources.total_count - 1;
      const subscribedPlan = this.props.customer.subscriptions.data[mostRecentSubscription].plan.id;
      const lastFour = this.props.customer.sources.data[mostRecentSource].last4;
      const pmtAmt = ((this.props.customer.subscriptions.data[mostRecentSubscription].plan.amount) / 100).toFixed(2);
      const pmtDate = moment.unix(this.props.customer.subscriptions.data[mostRecentSubscription].current_period_end).format('dddd, MMMM Do YYYY').toString();

      if (this.props.customer.subscriptions.data[mostRecentSubscription].cancel_at_period_end) {
        return (
          <div className="active-subscription">
              Your {subscribedPlan} plan will expire on {pmtDate}. You will not be charged again.
            </div>
        );
      } else {
        return (
          <div className="active-subscription">
              You are subscribed to the {subscribedPlan} plan.
              Your credit card ending in {lastFour} will be charged ${pmtAmt} on {pmtDate}.

              {this.renderAccountActions()}
          </div>
        );
      }
    }

    return (
      <div className="loading">
        Loading...
      </div>
    );
  }

  renderAccountActions() {
    if (this.state.cancelConfirm) {
      // TODO: Event handler for yes to dispatch action to cancel sub + redirect to "sorry to see you go" page
      return (
        <div className="cancel-confirm">
          <p>Do you really want to cancel your membership to ImproveFit?</p>
          <div className="action-buttons">
            <button className="btn btn-danger" onClick={this.props.cancelSubscription.bind(this)}>Yes</button>
            <button className="btn btn-primary" onClick={this.toggleCancelConfirm.bind(this)}>No</button>
          </div>
        </div>
      );
    } else if (this.state.changeSubscription) {
      return (
        <div className="action-buttons">
          <select className="form-control" name="newPlan" value={this.state.newPlan} onChange={this.handlePlanChange.bind(this)}>
            <option value="bronze">Bronze</option>
            <option value="silver">Silver</option>
            <option value="gold">Gold</option>
          </select>
          <button className="btn btn-primary" onClick={this.changePlanSubmit.bind(this)}>Change</button>
          <button className="btn btn-primary" onClick={this.toggleChangeSubscription.bind(this)}>Cancel</button>
        </div>
      );
    } else if (this.state.updateBilling) {
      return (
        <div className="action-buttons">
          <CheckoutForm /><button className="btn btn-danger" onClick={this.toggleUpdateBilling.bind(this)}>Cancel</button>
        </div>
      );
    } else {
      return (
        <div className="action-buttons">
          <button className="btn btn-primary" onClick={this.toggleChangeSubscription.bind(this)}>Change Subscription</button>
          <button className="btn btn-info" onClick={this.toggleUpdateBilling.bind(this)}>Update Billing Information</button>
          <button className="btn btn-danger" onClick={this.toggleCancelConfirm.bind(this)}>Cancel Subscription</button>
        </div>
      );
    }
  }

  toggleChangeSubscription(e) {
    e.preventDefault();

    if (this.state.changeSubscription) {
      this.setState({ changeSubscription: false });
    } else {
      this.setState({ changeSubscription: true });
    }
  }

  toggleCancelConfirm(e) {
    e.preventDefault();

    if (this.state.cancelConfirm) {
      this.setState({ cancelConfirm: false });
    } else {
      this.setState({ cancelConfirm: true });
    }
  }

  toggleUpdateBilling(e) {
    e.preventDefault();

    if (this.state.updateBilling) {
      this.setState({ updateBilling: false });
    } else {
      this.setState({ updateBilling: true });
    }
  }

  render() {
    return (
      <div className="user-subscription">
        {this.renderAlert()}
        {this.renderPlan()}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    customer: state.customer.customer,
  };
}

export default connect(mapStateToProps, actions)(BillingSettings);
