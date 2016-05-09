const Chat = require('../models/chat');

exports.inbox = function(req, res, next) {
  Chat.find({$or : [{'to': req.user._id}, {'from': req.user._id}]}, function(err, messages) {
    if (err) {
      res.send({ error: err });
      return next(err);
    }

    res.status(200).json({ messages: messages });
  });
}

exports.sendMessage = function(req, res, next) {
  const chat = new Chat({
    from: req.user._id,
    to: req.body.to,
    messageBody: req.body.messageBody
  });

  // Save message if no errors
  chat.save(function(err, message) {
    if (err) {
      res.send({ error: err });
      return next(err);
    }

    res.status(200).json({ message: 'Message sent!' });
  });
}
