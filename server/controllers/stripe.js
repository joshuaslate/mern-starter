const stripeConfig = require('../config/stripe');
const config = require('../config/main');
const mailgun = require('../config/mailgun');
const stripe = require('stripe')(config.stripeApiKey);
const moment = require('moment');
const User = require('../models/user');

exports.webhook = function (req, res, next) {
  // Store the event ID from the webhook
  const receivedEvent = req.body.data.id;

  // Request to expand the webhook for added security
  stripe.events.retrieve(receivedEvent, (err, verifiedEvent) => {
    if (err) { return next(err); }

      // Respond to webhook events, depending on what they are
    switch (verifiedEvent.type) {
        // On successful customer creation
      case 'customer.created':
        console.log('Customer was created...');
        break;
        // On successful invoice payment
      case 'invoice.payment_succeeded':
        User.findOne({ customerId: verifiedEvent.data.object.customer }, (err, user) => {
          if (err) { return next(err); }

            // Add a month to the user's subscription
          user.stripe.activeUntil = moment().add(1, 'months');

            // Save user with subscription
          user.save((err) => {
            if (err) { return err; }

            console.log(`${user.email} payment was successful. Subscription good until ${user.stripe.activeUntil}.`);
            return res.status(200);
          });
        });
        break;
      case 'invoice.payment_failed':
        User.findOne({ customerId: verifiedEvent.data.object.customer }, (err, user) => {
          if (err) { return next(err); }

            // Send email to customer to inform them their payment failed
          const message = {
            subject: 'Payment Failed',
            text: `You are receiving this because your most recent payment for $${verifiedEvent.data.object.amount_due / 100}failed.` +
              `\nThis could be due to a change or expiration on your provided credit card or interference from your bank.` +
              `\nPlease update your payment information as soon as possible by logging in at http://${req.headers.host}`
          };

          mailgun.sendEmail(user.email, message);
        });
        break;

      default:
        console.log(`Unrecognized action ${verifiedEvent.type} received.`);
    }

      // Return 200 status to inform Stripe the webhook was received
    return res.status(200);
  });
};

// Create customer object when new customer enters credit card
exports.createSubscription = function (req, res, next) {
  const plan = req.body.plan;
  const stripeToken = req.body.stripeToken;
  const userEmail = req.user.email;

  User.findById(req.user._id, (err, user) => {
    if (err) { return next(err); }

    // If the user has a Stripe customer object, save subscription
    if (user.stripe.customerId) {
      stripe.subscriptions.create({
        customer: user.stripe.customerId,
        plan
      }).then((subscription) => {
        user.stripe.lastFour = req.body.lastFour;
        user.stripe.subscriptionId = subscription.id;
        user.stripe.plan = plan;

        user.save((err, updatedUser) => {
          if (err) {
            res.status(422).send({ error: 'There was an error processing your request.' });
            return next(err);
          }

          return res.status(200).send({ message: `You have been successfully subscribed to the ${plan} plan.` });
        });
      }).catch(err => next(err));
    }

    // Otherwise create new Stripe customer object
    stripe.customers.create({
      source: stripeToken,
      email: userEmail,
      plan
    }).then((customer) => {
      const amtOfSubs = customer.subscriptions.total_count;
      user.stripe.lastFour = req.body.lastFour;
      user.stripe.customerId = customer.id;
      user.stripe.subscriptionId = customer.subscriptions.data[(amtOfSubs - 1)].id;
      user.stripe.plan = plan;

      user.save((err, updatedUser) => {
        if (err) {
          res.status(422).send({ error: 'There was an error processing your request.' });
          return next(err);
        }

        return res.status(200).send({ message: `You have been successfully subscribed to the ${plan} plan.` });
      });
    }).catch(err => next(err));
  });
};

exports.changeSubscription = function (req, res, next) {
    // Look up the user requesting a subscription change
  User.findById(req.user._id, (err, userToChange) => {
    if (err) { return next(err); }

    stripe.subscriptions.update(
        userToChange.stripe.subscriptionId,
        { plan: req.body.newPlan }).then((subscription) => {
          // On success, save new customer subscription to database
          userToChange.stripe.subscriptionId = subscription.id;
          userToChange.stripe.plan = subscription.plan.id;

          userToChange.save((err) => {
            if (err) {
              res.status(422).send({ error: 'There was an error processing your request.' });
              return next(err);
            }

            return res.status(200).send({ message: `Your subscription has been successfully updated to the ${subscription.plan.id} plan.` });
          });
        })
        .catch(err => err);
  });
};

exports.deleteSubscription = function (req, res, next) {
  // Look up the user requesting a subscription change
  User.findById(req.user._id, (err, userToChange) => {
    if (err) {
      return next(err);
    }

    stripe.subscriptions.del(userToChange.stripe.subscriptionId,
      { at_period_end: true }).then((subscription) => {
        userToChange.stripe.subscriptionId = '';
        userToChange.stripe.lastFour = '';
        userToChange.stripe.plan = '';
        userToChange.stripe.activeUntil = moment();

        userToChange.save((err, savedUser) => {
          if (err) { return next(err); }

          return res.status(200).json({ message: 'Subscription successfully deleted.' });
        });
      }).catch(err => next(err));
  });
};

exports.getCustomer = function (req, res, next) {
  User.findById(req.user._id, (err, userToFetch) => {
    if (err) {
      return next(err);
    }

    stripe.customers.retrieve(userToFetch.stripe.customerId)
      .then(customer => res.status(200).json({ customer })).catch(err => next(err));
  });
};

exports.updateCustomerBillingInfo = function (req, res, next) {
  User.findById(req.user._id, (err, userToChange) => {
    if (err) {
      return next(err);
    }

    stripe.customers.update(userToChange.stripe.customerId, {
      source: req.body.stripeToken
    }).then((customer) => {
      userToChange.stripe.lastFour = customer.sources.data[0].last4;

      userToChange.save((err, savedUser) => {
        if (err) {
          return next(err);
        }

        return res.status(200).json({ message: 'Payment method successfully updated.' });
      });
    }).catch(err => next(err));
  });
};
