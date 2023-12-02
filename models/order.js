const mongoose = require('mongoose');
const {
  BUYER_PRIVATE_INFO_DELETION,
} = require('../constants/buyerPrivateInfoDeletion');
const { ORDER_PRIVACY_TYPE } = require('../constants/orderPrivacyType');
const { ORDER_STATUS } = require('../constants/orderStatus');
const { setOrderMethodsToSchema } = require('./methods/order');

const { Schema, Types } = mongoose;

const OrderSchema = new Schema({
  buyer: {
    type: String,
    required: true,
  },
  vendor: {
    type: String,
    required: true,
  },
  product: {
    type: Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  buyerInformation: {
    type: String,
  },
  orderStatus: {
    type: String,
    enum: Object.values(ORDER_STATUS),
  },
  orderMoneroAddress: {
    type: String,
  },
  releaseMoneroAddress: {
    type: String,
  },
  orderDetails: {
    basePrice: {
      type: Number,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    exchangeRate: {
      type: Number,
      required: true,
    },
    xmrPrice: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    chosenShippingOption: {
      optionName: String,
      optionPrice: Number,
    },
    chosenSelection1: {
      selectionName: String,
      selectedChoice: {
        choiceName: String,
        choicePrice: Number,
      },
    },
    chosenSelection2: {
      selectionName: String,
      selectedChoice: {
        choiceName: String,
        choicePrice: Number,
      },
    },
  },
  timeUntilUpdate: {
    type: Number,
  },
  cancellationReason: {
    type: String,
  },
  settings: {
    leftReview: Boolean,
    timeResetLeft: Number,
    buyerPrivateInfoDeletion: {
      type: String,
      enum: Object.values(BUYER_PRIVATE_INFO_DELETION),
    },
    privacyType: {
      type: String,
      enum: Object.values(ORDER_PRIVACY_TYPE),
    },
  },
  disputeSettings: {
    disputeAdmin: String,
    disputeWinner: String,
    disputeReason: String,
  },
  orderChat: [
    {
      sender: {
        type: String,
        required: true,
      },
      message: {
        type: String,
        required: true,
      },
    },
  ],
});

setOrderMethodsToSchema(OrderSchema);

const OrderModel = mongoose.model('Order', OrderSchema);

module.exports = { OrderModel };
