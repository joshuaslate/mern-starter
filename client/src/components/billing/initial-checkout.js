import React, { Component } from 'react';

import CheckoutForm from './checkout-form';

class InitialCheckout extends Component {
  render() {
    return (
      <CheckoutForm plan={this.props.params.plan} />
    );
  }
}

export default InitialCheckout;
