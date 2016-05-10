const stripe = require('../config/stripe');
const moment = require('moment');
const User = require('../models/user');

exports.webhook = function(req, res, next) {
  // Store the event ID from the webhook
  const receivedEvent = req.body.data.id;

  // Request to expand the webhook for added security
  const verifiedEvent = stripe.retrieveWebhook(receivedEvent);

  // Respond to webhook events, depending on what they are
  switch(verifiedEvent.type) {
    case "customer.created":
      console.log("Customer was created...");
      break;
    case "charge.succeeded":
      User.findOne({ customerId: verifiedEvent.data.object.card.customer }, function(err, user) {
        if (err) { return err; }

        // Add a month to the user's subscription
        user.activeUntil = moment().add(1, "months");

        // Save user with subscription
        user.save(function(err) {
          if (err) { return err; }

          return user;
        });
      });

      break;
    default:
      console.log("Unrecognized action " + verifiedEvent.type + " received.");
  }

  // Return 200 status to inform Stripe the webhook was received
  res.status(200);
  return next();
}
