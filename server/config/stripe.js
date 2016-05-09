const config = require('./main');
const stripe = require('stripe');

stripe.setApiKey(config.stripeApiKey);
stripe.setTimeout(20000);

exports.createCustomer = function(stripeToken, email, plan) {
  // Create new Stripe customer object
  stripe.customers.create({
    description: email,
    source: stripeToken
  }).then(function(customer) {
    // Return customer object and subscribe to plan
  }).catch(function(err) {
    return err;
  });
}
