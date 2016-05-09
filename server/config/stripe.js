const config = require('./main');
const moment = require('moment');
const stripe = require('stripe')(config.stripeApiKey);
const User = require('../models/user');

stripe.setTimeout(20000);

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

      if (!email) {
        return console.log("No user found with the provided email address.");
      }

      // Save Stripe customer ID to user document
      user.customerId = customer.id;

      // Add a month to the user's subscription
      user.activeUntil = moment().add(1, "months");

      user.save(function(err) {
        if (err) { return err; }

        return customer;
      });
    });
  }).catch(function(err) {
    return err;
  });
}

exports.retrieveWebhook = function(eventId) {
  stripe.events.retrieve(eventId, function(err, event) {
    if (err) { return err; }

    return event;
  });
}
