const config = require('./main');
const stripe = require('stripe')(config.stripeApiKey);
const User = require('../models/user');

stripe.setTimeout(20000);

// Function to create a new customer and add them to a plan
exports.createCustomer = function(stripeToken, email, plan) {
  // Create new Stripe customer object
  stripe.customers.create({
    source: stripeToken,
    email: email,
    plan: plan
  }).then(function(customer) {
    // Return customer object and save ID to user
    User.findOne({ email: email }, function(err, user) {
      if (err) { return err; }

      // Save Stripe customer ID to user document
      user.customerId = customer.id;

      user.save(function(err) {
        if (err) { return err; }

        return customer;
      });
    });
  }).catch(function(err) {
    return err;
  });
}

// Function to retrieve webhook for validation/security
exports.retrieveWebhook = function(eventId) {
  stripe.events.retrieve(eventId, function(err, event) {
    if (err) { return err; }

    return event;
  });
}
