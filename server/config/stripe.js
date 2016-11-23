const config = require('./main');
const stripe = require('stripe')(config.stripeApiKey);

stripe.setTimeout(20000);
