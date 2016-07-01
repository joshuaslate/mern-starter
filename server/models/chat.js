const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({
    messageBody: {
      type: String,
      required: true
    },
    from: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true // Saves createdAt and updatedAt as dates. createdAt will be our timestamp.
  });

// Schema defines how chat messages will be stored in MongoDB
const ConversationSchema = new mongoose.Schema({
  participants: [String],
  lastMessage: {
    author: { type: String },
    excerpt: { type: String }
  },
  messages: [ChatSchema]
},
{
  timestamps: true // Saves createdAt and updatedAt as dates. createdAt will be our timestamp.
});

module.exports = mongoose.model('Chat', ChatSchema);
module.exports = mongoose.model('Conversation', ConversationSchema);
