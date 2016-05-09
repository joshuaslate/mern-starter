const User = require('../models/user');

//========================================
// View Profile Route
//========================================
exports.viewProfile = function(req, res, next) {
  if (!req.user._id == req.params.user_id) { return res.status(401).json({ error: 'You are not authorized to view this user profile.'}); }
    User.findById(req.params.user_id, function(err, user) {
      if (err) {
        res.status(400).json({ error: 'No user could be found for this ID.' });
        return next(err);
      }

      res.status(200).json({ user: user });
      next();
    });
}
