const AuthenticationController = require('./controllers/authentication'),
      UserController = require('./controllers/user'),
      ChatController = require('./controllers/chat'),
      StripeController = require('./controllers/stripe'),
      express = require('express'),
      passportService = require('./config/passport'),
      passport = require('passport');

// Middleware to require login/auth
const requireAuth = passport.authenticate('jwt', { session: false });
const requireLogin = passport.authenticate('local', { session: false });

// Constants for role types
const REQUIRE_ADMIN = "Admin",
      REQUIRE_OWNER = "Owner",
      REQUIRE_CLIENT = "Client",
      REQUIRE_MEMBER = "Member";

module.exports = function(app) {
  // Initializing route groups
  const apiRoutes = express.Router(),
        authRoutes = express.Router(),
        userRoutes = express.Router(),
        chatRoutes = express.Router(),
        payRoutes = express.Router();

  //=========================
  // Auth Routes
  //=========================

  // Set auth routes as subgroup/middleware to apiRoutes
  apiRoutes.use('/auth', authRoutes);

  // Registration route
  authRoutes.post('/register', AuthenticationController.register);

  // Login route
  authRoutes.post('/login', requireLogin, AuthenticationController.login);

  // Password reset request route (generate/send token)
  authRoutes.post('/forgot-password', AuthenticationController.forgotPassword);

  authRoutes.post('/reset-password/:token', AuthenticationController.verifyToken);

  //=========================
  // User Routes
  //=========================

  // Set user routes as a subgroup/middleware to apiRoutes
  apiRoutes.use('/user', userRoutes);

  // View user profile route
  userRoutes.get('/:user_id', requireAuth, UserController.viewProfile);

  // Test protected route
  apiRoutes.get('/protected', requireAuth, function(req, res) {
    res.send({ content: 'The protected test route is functional!'});
  });

  //=========================
  // Chat Routes
  //=========================

  // Set chat routes as a subgroup/middleware to apiRoutes
  apiRoutes.use('/chat', chatRoutes);

  // View messages to and from authenticated user
  chatRoutes.get('/inbox', requireAuth, ChatController.inbox);

  // Send new message
  chatRoutes.post('/send', requireAuth, ChatController.sendMessage);

  //=========================
  // Payment Routes
  //=========================
  apiRoutes.use('/pay', payRoutes);

  // Webhook endpoint for Stripe
  payRoutes.post('/webhook-notify', StripeController.webhook);

  // Setting endpoint for apiRoutes
  app.use('/api', apiRoutes);
}
