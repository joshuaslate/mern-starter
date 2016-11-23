import React, { Component } from 'react';
import CheckoutFields from './checkout-fields';
import { connect } from 'react-redux';
import * as actions from '../../actions/billing';

/* TODO:
*   - Pass more information down with redux state (i.e., billing address initial val)
*/

class CheckoutForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      stripePublicKey: 'pk_test_XXXXXXXXXXXXXXXXXXXXXXXX',
      cardNumber: '',
      expMonth: '',
      expYear: '',
      cvc: '',
      error: '',
    };
  }

  componentWillMount() {
    // Import Stripe.js
    this.loadStripe();
  }

  loadStripe() {
    // Check if Stripe is already loaded first
    if (!document.getElementById('stripe-import')) {
      const stripeJs = document.createElement('script');
      stripeJs.id = 'stripe-import';
      stripeJs.src = 'https://js.stripe.com/v2/';
      stripeJs.type = 'text/javascript';
      stripeJs.async = true;

      document.body.appendChild(stripeJs);
    }
  }

  handleFormChange(e) {
    e.preventDefault();

    switch (e.target.id) {
      case 'cardNumber': return (this.setState({ cardNumber: e.target.value }));
      case 'cvc': return (this.setState({ cvc: e.target.value }));
      case 'expMonth': return (this.setState({ expMonth: e.target.value }));
      case 'expYear': return (this.setState({ expYear: e.target.value }));
    }
  }

  handleSubmit(e) {
    e.preventDefault();

    const that = this;

    that.setState({ error: '' });

    Stripe.setPublishableKey(this.state.stripePublicKey);
    Stripe.card.createToken({
      number: this.state.cardNumber,
      cvc: this.state.cvc,
      exp_month: this.state.expMonth,
      exp_year: this.state.expYear,
    }, (status, response) => {
      if (response.error) {
        that.setState({ error: response.error });

        return;
      }

      // Action to save customer token and create charge
      const plan = that.props.plan;
      const stripeToken = response.id;
      const lastFour = response.card.last4;

      if (!plan) {
        that.props.updateBilling(stripeToken);
      } else {
        that.props.createCustomer(stripeToken, plan, lastFour);
      }
    });
  }

  render() {
    return (
      <div className="checkout-form">
        {this.state.error.message}
        <CheckoutFields
          handleChange={this.handleFormChange.bind(this)}
          onSubmit={this.handleSubmit.bind(this)}
          formState={this.state}
        />
      </div>
    );
  }
}

export default connect(null, actions)(CheckoutForm);
