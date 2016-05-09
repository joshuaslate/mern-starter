const stripe = require('../config/stripe');

exports.webhook = function(req, res, next) {
  // Store the event ID from the webhook
  const receivedEvent = req.body.id;

  // Request to expand the webhook for added security
  const verifiedEvent = stripe.retrieveWebhook(receivedEvent);

  // Respond to webhook events, depending on what they are
  switch(verifiedEvent.type) {
    case "customer.created":
      console.log("Customer was created...");
      break;
    default:
      console.log("Unrecognized action " + verifiedEvent.type + " received.");
  }

  // Return 200 status to inform Stripe the webhook was received
  res.status(200);
  return next();
}
