const Conversation = require('../models/chat');
const User = require('../models/user');

exports.getConversations = function(req, res, next) {
  // Only return one message from each conversation to display as snippet
  Conversation.find({ participants: req.user._id })
  .select('lastMessage updatedAt participants')
  .exec(function(err, conversations) {
    if (err) {
      res.send({ error: err });
      return next(err);
    }

    // Setting fields to query from User model for given message
    const selectForPopulate = "profile.firstName profile.lastName"
    const path = "lastMessage.author participants"

    User.populate(conversations, { path: path, select: selectForPopulate, model: 'User' }, function(err, convos) {
      if (err) {
        res.send({ error: err });
        return next(err);
      }

      res.status(200).json({ conversations: convos });
    });
  });
}

exports.getConversation = function(req, res, next) {
  Conversation.find({ _id: req.params.conversationId }, 'messages', function(err, messages) {
    if (err) {
      res.send({ error: err });
      return next(err);
    }

      // Setting fields to query from User model for given message
      const selectForPopulate = "profile.firstName profile.lastName email"

      User.populate(messages, { path: 'messages.from', select: selectForPopulate, model: 'User' }, function(err, authoredMessages) {
        if (err) {
          res.send({ error: err });
          return next(err);
        }

        res.status(200).json({ conversation: authoredMessages });
        return next();
      });
  });
}

exports.newConversation = function(req, res, next) {
  // TODO: add validation for recipients
  const conversation = new Conversation({
    participants: [req.user._id, req.params.recipient],
    messages: [{
      from: req.user._id,
      messageBody: req.body.composedMessage
    }],
    lastMessage: {
      excerpt: '',
      author: ''
    }
  });

  conversation.save(function(err, conversation) {
    if (err) {
      res.send({ error: err });
      return next(err);
    }

    // Set the excerpt and conversation IDs to variables to play nicely with
    // mongoose's findByIdAndUpdate method
    const conversationId = conversation._id;
    const excerpt = conversation.messages[0].messageBody;
    const author = conversation.messages[0].from;

    // Immediately update the excerpt field to include the ID of the
    // most recent message saved
    Conversation.findByIdAndUpdate(conversationId, {
      $set: {
        'lastMessage.author': author,
        'lastMessage.excerpt': excerpt
      }
    }, function(err, updatedConversation) {
        if (err) { return err; }

        res.status(200).json({ message: 'Conversation started!', conversationId: updatedConversation._id });
        return next();
    });
  });
}

exports.sendReply = function(req, res, next) {
    Conversation.findById(req.params.conversationId, function(err, conversation) {
      if (err) {
        res.send({ error: err });
        return next(err);
      }

        // Updating the excerpt for inbox display
        conversation.lastMessage.excerpt = req.body.composedMessage;
        conversation.lastMessage.from = req.user._id;

        conversation.messages.push({
          messageBody: req.body.composedMessage,
          from: req.user._id
        });

        conversation.save(function(err, updatedConversation) {
          if(err) {
            res.send({ error: err });
            return next(err);
          }

            res.status(200).json({ message: 'Reply successfully sent!' });
            return next();
        });
    });
  }

exports.getRecipients = function(req, res, next) {
  // Get list of users
  User.find()
  .select('_id profile.firstName profile.lastName')
  .exec(function(err, recipients) {
    if (err) {
      return next(err);
    }

    res.status(200).json({ recipients: recipients });
  });
}
