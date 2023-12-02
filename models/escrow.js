const { Schema, default: mongoose } = require('mongoose');

const ESCROW_STATUS = {
  PENDING: 'PENDING',
  RECEIVED: 'RECEIVED',
  RETRYING: 'RETRYING',
  RELEASING: 'RELEASING',
  RELEASED: 'RELEASED',
  CANCELLED: 'CANCELLED',
  REFUNDED: 'REFUNDED',
};

const EscrowSchema = new Schema({
  paymentId: {
    type: String,
    required: true,
    unique: true,
  },
  orderId: {
    type: Schema.Types.ObjectId,
    ref: 'Order',
    required: true,
  },
  retryCount: {
    type: Number,
    default: 0,
  },
  paymentAddress: {
    type: String,
    required: true,
  },
  releaseAddress: {
    type: String,
  },
  releaseTxHash: {
    type: String,
  },
  releaseAmount: {
    type: Number,
  },
  releaseAmountAtomic: {
    type: String,
  },
  releaseFee: {
    type: Number,
  },
  releaseFeeAtomic: {
    type: String,
  },
  amount: {
    type: Number,
  },
  amountAtomic: {
    type: String,
  },
  status: {
    type: String,
    required: true,
    enum: Object.values(ESCROW_STATUS),
  },
  statusDate: {
    type: Date,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

module.exports = {
  ESCROW_STATUS,
  EscrowModel: mongoose.model('Escrow', EscrowSchema),
};
