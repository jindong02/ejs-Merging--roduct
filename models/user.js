const mongoose = require('mongoose');
const { setUserMethodsToSchema } = require('./methods/user');

const reviewSchema = new mongoose.Schema({
  number_review: {
    type: Number,
    required: true,
  },
  total_note: {
    type: Number,
    required: true,
  },
  average_note: {
    type: Number,
    required: true,
  },
});

const messageSettingsSchema = new mongoose.Schema({
  displayUsername: {
    type: String,
  },
  conversationPgp: {
    type: String,
  },
  customPgp: {
    type: String,
  },
  customUsername: {
    type: String,
  },
  messageExpiryDate: {
    type: Number,
  },
  convoExpiryDate: {
    type: Number,
  },
  includeTimestamps: {
    type: Boolean,
  },
  messageView: {
    type: Boolean,
  },
  deleteEmpty: {
    type: Boolean,
  },
});

const notificationsSettingsSchema = new mongoose.Schema({
  recordNotification: {
    type: Boolean,
    default: true,
    required: false,
  },
  expiryDate: {
    type: Number,
    default: 7,
  },
  seen: {
    type: Boolean,
  },
  sendNotification: {
    type: {
      orderStatusChange: {
        type: Boolean,
      },
      newConversation: {
        type: Boolean,
      },
      newMessage: {
        type: Boolean,
      },
      changeConversationSettings: {
        type: Boolean,
      },
      deleteMessage: {
        type: Boolean,
      },
      deleteConversation: {
        type: Boolean,
      },
      newUpdate: {
        type: Boolean,
      },
    },
    default: {
      orderStatusChange: true,
      newConversation: true,
      changeConversationSettings: true,
      deleteConversation: true,
      newUpdate: true,
    },
    required: false,
  },
});

const settingsSchema = new mongoose.Schema({
  messageSettings: {
    type: messageSettingsSchema,
    default: {
      displayUsername: 'customUsername',
      conversationPgp: 'showPgp',
      messageExpiryDate: 7,
      convoExpiryDate: 180,
      deleteEmpty: true,
    },
    required: true,
  },
  notificationsSettings: {
    type: notificationsSettingsSchema,
    default: {},
    required: false,
  },
  privateInfoExpiring: {
    type: Number,
    default: 7,
  },
  userExpiring: {
    type: Number,
  },
  currency: {
    type: String,
    required: true,
    default: 'USD',
  },
  step_verification: {
    type: String,
  },
});

const UserSchema = new mongoose.Schema({
  img_path: {
    type: String,
  },
  username: {
    type: String,
    required: true,
    maxlength: 50,
    minlength: 3,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  authorization: {
    type: String,
    required: true,
    default: 'buyer',
  },
  awaiting_promotion: {
    type: Boolean,
  },
  email: {
    type: String,
  },
  email_verification_code: {
    type: String,
  },
  pgp_keys: {
    type: String,
  },
  verifiedPgpKeys: {
    type: String,
  },
  pgp_keys_verification_words: {
    type: String,
  },
  pgp_keys_verification_words_encrypted: {
    type: String,
  },
  settings: {
    type: settingsSchema,
    default: {},
    required: true,
  },
  job: {
    type: String,
  },
  description: {
    type: String,
  },
  achievement: {
    type: Array,
  },
  languages: {
    type: Array,
  },
  saved_product: {
    type: Array,
  },
  vendorMoneroAddress: {
    type: String,
  },
  xmrRefundAddress: {
    type: String,
  },
  review: {
    type: reviewSchema,
    required: true,
    default: { number_review: 0, total_note: 0, average_note: 0 },
  },
  warning: {
    type: Number,
    default: 0,
  },
  notifications: {
    type: [
      {
        type: {
          type: String,
          requried: true,
        },
        data: {
          type: Array,
        },
        seen: {
          type: Boolean,
        },
        expireAt: {
          type: Number,
        },
      },
    ],
    maxlength: 50,
  },
  expire_at: {
    type: Number,
  },
});

setUserMethodsToSchema(UserSchema);

module.exports = {
  UserModel: mongoose.model('User', UserSchema),
};
