const { default: mongoose } = require('mongoose');

const WRONG_TRANSACTION_TYPES = {
  UNAUTHORIZED: 'UNAUTHORIZED',
  BAD_PAYMENT_ID: 'BAD_PAYMENT_ID',
  BAD_ESCROW_STATUS: 'BAD_ESCROW_STATUS',
  ALREADY_RELEASED: 'ALREADY_RELEASED',
  ALREADY_CANCELLED: 'ALREADY_CANCELLED',
};

const TRANSACTION_TYPES = {
  INCOMING: 'INCOMING',
  OUTGOING: 'OUTGOING',
};

const WrongTransactionSchema = new mongoose.Schema({
  txHash: {
    type: String,
    required: true,
  },
  transactionType: {
    type: String,
    enum: Object.values(TRANSACTION_TYPES),
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: Object.values(WRONG_TRANSACTION_TYPES),
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = {
  WRONG_TRANSACTION_TYPES,
  TRANSACTION_TYPES,
  WrongTransactionModel: mongoose.model('WrongTransaction', WrongTransactionSchema),
};
