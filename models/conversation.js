const mongoose = require('mongoose');
const { setConversationMethodsToSchema } = require('./methods/conversation');

const usersSchema = new mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
  },
  userId: {
    type: String,
    required: true,
  },
  displayUsername: {
    type: String,
  },
  conversationPgp: {
    type: String,
  },
  messageExpiryDate: {
    type: String,
  },
});

const settingsSchema = new mongoose.Schema({
  includeTimestamps: {
    type: Boolean,
  },
  messageView: {
    type: Boolean,
  },
  deleteEmpty: {
    type: Boolean,
  },
  conversationPassword: {
    type: String,
  },
  daysUntilExpiring: {
    type: Number,
  },
  convoExpiryDate: {
    type: Number,
  },
});

const conversationSchema = new mongoose.Schema({
  users: [usersSchema],
  messages: {
    type: Array,
    required: true,
  },
  settings: {
    type: settingsSchema,
  },
});

conversationSchema.statics.findAllConversationWithId = async function ({ ids, populate }) {
  const conversations = [];

  if (ids) {
    for (let i = 0; i < ids.length; i++) {
      conversations.push(this.findById(ids[i].convoId).populate(populate));
    }
  }

  const returnedConversation = await Promise.all(conversations);

  return returnedConversation.filter((elem) => elem);
};

conversationSchema.statics.findAllConversationOfUser = async function ({ userId, populate, ids }) {
  const conversations = await Promise.all([
    await this.findAllConversationWithId({ ids, populate }),
    await this.find({ users: { $elemMatch: { user: userId } } }).populate(populate),
  ]);

  const returnedConversation = conversations[1];

  for (let i = 0; i < conversations[0].length; i++) {
    returnedConversation.unshift(conversations[0][i]);
  }

  return returnedConversation;
};

conversationSchema.statics.findConversationExist = async function ({ userId, id }) {
  const conversations = await this.find({
    $and: [
      { 'users.userId': userId },
      { 'users.userId': id },
    ],
  });

  return conversations;
};

conversationSchema.statics.findConversationWithId = async function ({ id, populate }) {
  const conversation = this.findOne({ 'users.userId': id }).populate(populate);

  return conversation;
};

setConversationMethodsToSchema(conversationSchema);

module.exports = {
  ConversationModel: mongoose.model('Conversation', conversationSchema),
};
