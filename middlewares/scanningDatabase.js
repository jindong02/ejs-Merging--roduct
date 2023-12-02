/* eslint-disable no-await-in-loop */
const { ConversationModel } = require('../models/conversation');
const { OrderModel } = require('../models/order');
const { UserModel } = require('../models/user');
const { ProductModel } = require('../models/product');
const { ORDER_STATUS } = require('../constants/orderStatus');

async function deleteExpiredNotifications() {
  const dateNow = Date.now();
  const userExpiredNotifications = await UserModel.find({ $and: [{ 'notifications.expireAt': { $lt: dateNow } }, { 'notifications.expireAt': { $gt: -1 } }] });

  for (let i = 0; i < userExpiredNotifications.length; i++) {
    userExpiredNotifications[i].deleteExpiredNotifications(dateNow);
    userExpiredNotifications[i].save();
  }
}

async function deleteInactiveUser() {
  const users = await UserModel.find({ expire_at: { $lt: Date.now() } });

  for (let i = 0; i < users.length; i++) {
    users[i].deleteUser();
  }
}

async function deleteExpiredConversation() {
  const dateNow = Date.now();
  const expiredConversation = await ConversationModel.find({ 'settings.convoExpiryDate': { $lt: dateNow } });

  for (let i = 0; i < expiredConversation.length; i++) {
    expiredConversation[i].deleteConversation();
  }
}

async function deleteExpiredMessages() {
  const dateNow = Date.now();
  const converstionWithExpiredMessage = await ConversationModel.find({ 'messages.expireAt': { $lt: dateNow } });

  for (let i = 0; i < converstionWithExpiredMessage.length; i++) {
    converstionWithExpiredMessage[i].deleteExpiredMessage({ dateNow });
    converstionWithExpiredMessage[i].emptyMessage();
  }
}

async function hasOrderBeenPaid() {
  const orders = await OrderModel.find({
    orderStatus: ORDER_STATUS.AWAITING_PAYMENT,
  });

  for (let i = 0; i < orders.length; i++) {
    orders[i].checkPaid();
  }
}

// Refund if paid
async function handleOrderWithExpiredTimer() {
  const orders = await OrderModel.find({
    timeUntilUpdate: { $lt: Date.now() },
  });

  for (let i = 0; i < orders.length; i++) {
    if (orders[i].orderStatus !== ORDER_STATUS.FINALIZED) orders[i].expiredOrder();
    else orders[i].applyPrivacyMeasure();

    orders[i].save();
  }
}

async function findAndendSales() {
  const products = await ProductModel.find({ sales_end: { $lt: Date.now() } });

  for (let i = 0; i < products.length; i++) {
    products[i].endSales();
    products[i].save();
  }
}

// try to release failed escrow release (due to locked balance)
async function retryEscrowRelease() {
  //
}
function allDatabaseScanningFunction() {
  setInterval(() => {
    deleteExpiredNotifications();
    deleteExpiredMessages();
    console.log('1min');
  }, 60000); // 1 min

  setInterval(() => {
    console.log('5min');
    handleOrderWithExpiredTimer();
    findAndendSales();
  }, 5 * 60 * 1000); // 5min

  // increased payment check time to 1h since payment check will be done by webhook
  // this is to prevent the case where the webhook is not called
  setInterval(() => {
    console.log('1h');
    hasOrderBeenPaid();
    retryEscrowRelease();
  }, 60 * 60 * 1000); // 1h

  setInterval(() => {
    console.log('1day');
    deleteExpiredConversation();
    deleteInactiveUser();
  }, 24 * 60 * 60 * 1000); // 1day
}

module.exports = { allDatabaseScanningFunction };
