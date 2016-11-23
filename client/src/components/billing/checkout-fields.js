import React, { Component } from 'react';

class CheckoutFields extends Component {
  render() {
    return (
      <form onSubmit={this.props.onSubmit.bind(this.value)}>
        <div className="row">
          <div className="col-md-9">
            <label>Card Number</label>
            <input
              id="cardNumber"
              className="form-control"
              onChange={this.props.handleChange.bind(this.value)}
              value={this.props.formState.cardNumber}
              autoComplete="off"
            />
          </div>

          <div className="col-md-3">
            <label>CVC</label>
            <input
              id="cvc"
              className="form-control"
              onChange={this.props.handleChange.bind(this.value)}
              value={this.props.formState.cvc}
              autoComplete="off"
            />
          </div>
        </div>

        <div className="row">
          <div className="col-md-6">
            <label>Expiration Month (MM)</label>
            <input
              id="expMonth"
              className="form-control"
              onChange={this.props.handleChange.bind(this.value)}
              value={this.props.formState.expMonth}
              autoComplete="off"
            />
          </div>

          <div className="col-md-6">
            <label>Expiration Year (YYYY)</label>
            <input
              id="expYear"
              className="form-control"
              onChange={this.props.handleChange.bind(this.value)}
              value={this.props.formState.expYear}
              autoComplete="off"
            />
          </div>
        </div>

        <button type="submit" className="btn btn-primary">Get Started!</button>
      </form>
    );
  }
}

export default CheckoutFields;
