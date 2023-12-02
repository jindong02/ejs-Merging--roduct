/* eslint-disable global-require */
/* eslint-disable class-methods-use-this */
const { MoneroWalletListener, BigInteger } = require('monero-javascript');
const { ORDER_STATUS } = require('../constants/orderStatus');
const { EscrowModel, ESCROW_STATUS } = require('../models/escrow');
const {
  WrongTransactionModel,
  WRONG_TRANSACTION_TYPES,
  TRANSACTION_TYPES,
} = require('../models/wrongTransaction');

class EscrowListener extends MoneroWalletListener {
  constructor(escrow) {
    super();

    this.escrow = escrow;
  }

  async onOutputReceived(input) {
    console.log('Output received!');
    console.log(input);

    const tx = input.getTx();

    const isConfirmed = tx.isConfirmed();
    const isRelayed = tx.isRelayed();
    const isFailed = tx.isFailed();

    if (!isConfirmed || !isRelayed || isFailed) {
      // transaction is not confirmed yet
      // it will called again when it is confirmed
      return;
    }

    const paymentId = tx.getPaymentId();

    if (!paymentId) {
      // transaction is not related to escrow
      // saving transaction just in case someone wanted to refund
      await WrongTransactionModel.create({
        transactionType: TRANSACTION_TYPES.INCOMING,
        txHash: tx.getHash(),
        type: WRONG_TRANSACTION_TYPES.BAD_PAYMENT_ID,
      });

      return;
    }

    const escrow = await EscrowModel.findOne({
      paymentId,
    });

    if (!escrow) {
      await WrongTransactionModel.create({
        transactionType: TRANSACTION_TYPES.INCOMING,
        txHash: tx.getHash(),
        type: WRONG_TRANSACTION_TYPES.BAD_PAYMENT_ID,
      });

      return;
    }

    const { status, amountAtomic, paymentAddress } = escrow;

    if (status === ESCROW_STATUS.RELEASED) {
      await WrongTransactionModel.create({
        transactionType: TRANSACTION_TYPES.INCOMING,
        txHash: tx.getHash(),
        type: WRONG_TRANSACTION_TYPES.ALREADY_RELEASED,
      });

      return;
    }

    if (status === ESCROW_STATUS.CANCELLED) {
      await WrongTransactionModel.create({
        transactionType: TRANSACTION_TYPES.INCOMING,
        txHash: tx.getHash(),
        type: WRONG_TRANSACTION_TYPES.ALREADY_CANCELLED,
      });
      return;
    }

    const transactions = await this.escrow.checkIncomingTransactionByAddress(
      paymentAddress,
    );

    const trxAmount = transactions.reduce((acc, transaction) => {
      const { amount } = transaction;

      return acc.add(amount);
    }, BigInteger.ZERO);

    if (trxAmount.compare(amountAtomic) >= 0) {
      // only when all amount is received we change status
      // if user sends less than amount user can send again (we support partial payments)
      escrow.set({
        status: ESCROW_STATUS.RECEIVED,
        statusDate: new Date(),
      });

      const { OrderModel } = require('../models/order');

      const order = await OrderModel.findOne({
        _id: escrow.orderId,
      });

      if (order && order.orderStatus === ORDER_STATUS.AWAITING_PAYMENT) {
        order.set({
          orderStatus: ORDER_STATUS.AWAITING_SHIPMENT,
        });
        order.calculateTimer(3 * 24 * 60 * 60 * 1000); // 3 days
        await order.save();
      }

      await escrow.save();
    }
  }

  // when escrow releases the money
  async onOutputSpent(output) {
    const tx = output.getTx();
    const hash = tx.getHash();
    const isConfirmed = tx.isConfirmed();
    const isRelayed = tx.isRelayed();
    const isFailed = tx.isFailed();

    if (!isConfirmed || !isRelayed || isFailed) {
      return;
    }

    const escrow = await EscrowModel.findOne({
      releaseTxHash: hash,
    });

    if (!escrow) {
      // just in case
      await WrongTransactionModel.create({
        transactionType: TRANSACTION_TYPES.OUTGOING,
        txHash: hash,
        type: WRONG_TRANSACTION_TYPES.UNAUTHORIZED,
      });
      return;
    }

    if (escrow.status !== ESCROW_STATUS.RELEASING) {
      // just in case
      await WrongTransactionModel.create({
        transactionType: TRANSACTION_TYPES.OUTGOING,
        txHash: hash,
        type: WRONG_TRANSACTION_TYPES.BAD_ESCROW_STATUS,
      });
      return;
    }

    escrow.set({
      status: ESCROW_STATUS.RELEASED,
      statusDate: new Date(),
    });

    await escrow.save();
  }
}

module.exports = { EscrowListener };
