const { MoneroIncomingTransfer, BigInteger } = require('monero-javascript');
const { toFloat } = require('.');
const { EscrowModel, ESCROW_STATUS } = require('../models/escrow');
const { WrongTransactionModel } = require('../models/wrongTransaction');
const { EscrowListener } = require('./EscrowListener');

class Escrow {
  walletRpc;

  wallet;

  account;

  accountIndex;

  address;

  escrowListener;

  async setUpEscrow(walletRpc, wallet, account) {
    if (!walletRpc) {
      throw new Error('Wallet RPC is required!');
    }

    this.walletRpc = walletRpc;

    if (!wallet) {
      throw new Error('Wallet is required!');
    }

    this.wallet = wallet;

    if (!account) {
      throw new Error('Account is required!');
    }

    this.account = account;
    this.accountIndex = account.getIndex();
    this.address = account.getPrimaryAddress();
    this.escrowListener = new EscrowListener(this);
    this.walletRpc.addListener(this.escrowListener);
  }

  async getBalance() {
    const balance = await this.walletRpc.getBalance(this.accountIndex);

    return balance;
  }

  async getUnlockedBalance() {
    const unlockedBalance = await this.walletRpc.getUnlockedBalance(
      this.accountIndex,
    );

    return unlockedBalance;
  }

  async createEscrow({ amount, orderId, releaseAddress }) {
    if (!amount || amount <= 0) {
      throw new Error('Amount is required!');
    }

    if (Number.isNaN(parseFloat(amount, 10))) {
      throw new Error('Amount is not a number!');
    }

    if (!releaseAddress) {
      throw new Error('Release address is required!');
    }

    const integratedAddressState = await this.walletRpc.getIntegratedAddress(
      this.address,
    );

    const { state } = integratedAddressState || {};

    const { paymentId, integratedAddress } = state || {};

    if (!paymentId || !integratedAddress) {
      throw new Error('Integrated address failed to generate!');
    }

    const amountAtomic = BigInteger.parse(`${amount}*10^12`).toString();

    const escrow = await EscrowModel.create({
      paymentId,
      orderId,
      paymentAddress: integratedAddress,
      releaseAddress,
      amount,
      amountAtomic,
      status: ESCROW_STATUS.PENDING,
      statusDate: new Date(),
    });

    return escrow;
  }

  async checkIncomingTransactionByAddress(address) {
    const transactions = await this.walletRpc.getIncomingTransfers(address);

    return transactions
      .filter((transaction) => {
        if (!(transaction instanceof MoneroIncomingTransfer)) {
          return false;
        }

        return transaction.isIncoming();
      })
      .map((transaction) => ({
        tx: transaction.getTx(),
        amount: transaction.getAmount(),
      }))
      .filter((transaction) => {
        const { tx } = transaction;
        return tx.isConfirmed() && tx.isRelayed() && !tx.isFailed();
      });
  }

  async createTransaction({ amount, address }) {
    const transaction = await this.walletRpc.createTx({
      accountIndex: this.accountIndex,
      address,
      amount,
      relay: false,
    });

    return transaction;
  }

  // only refund incoming wrong transactions
  // it includes payment received on released or canceled escrow, or wrong address etc.
  // needed paymentProof aka txKey to refund
  async refundWrongTransaction({
    txKey, txHash, sentAddress, refundAddress,
  }) {
    const wrongTransaction = await WrongTransactionModel.findOne({
      txHash,
    });

    if (!wrongTransaction) {
      throw new Error('Wrong transaction not found!');
    }

    const check = await this.walletRpc.checkTxKey(txHash, txKey, sentAddress);

    if (!check || !check.isGood) {
      throw new Error('Wrong transaction key!');
    }

    const tx = await this.walletRpc.getTx(txHash);

    const unlockedBalance = await this.getUnlockedBalance();

    if (unlockedBalance.compare(tx.getAmount()) < 0) {
      throw new Error('Insufficient unlocked balance! Try again later.');
    }

    const transaction = await this.createTransaction({
      amount: tx.getAmount().toString(),
      address: refundAddress,
    });

    const fee = transaction.getFee();

    const refundTransaction = await this.createTransaction({
      amount: tx.getAmount().subtract(fee).toString(),
      address: refundAddress,
    });

    await this.walletRpc.relayTx(refundTransaction);

    await wrongTransaction.remove();
  }

  // to refund cancelled escrow also need txKey
  async refundCancelled({ txKey, txHash, refundAddress }) {
    const tx = await this.walletRpc.getTx(txHash);

    const paymentId = tx.getPaymentId();

    if (!paymentId) {
      throw new Error('Payment ID not found!');
    }

    const escrow = await EscrowModel.findOne({
      paymentId,
    });

    if (!escrow) {
      throw new Error('Escrow not found!');
    }

    if (escrow.status !== ESCROW_STATUS.CANCELLED) {
      throw new Error('Escrow is not cancelled!');
    }

    const check = await this.walletRpc.checkTxKey(
      txHash,
      txKey,
      escrow.paymentAddress,
    );

    if (!check || !check.isGood) {
      throw new Error('Wrong transaction key!');
    }

    const unlockedBalance = await this.getUnlockedBalance();

    if (unlockedBalance.compare(tx.getAmount()) < 0) {
      throw new Error('Insufficient unlocked balance! Try again later.');
    }

    const transaction = await this.createTransaction({
      amount: tx.getAmount().toString(),
      address: refundAddress,
    });

    const fee = transaction.getFee();

    const refundTransaction = await this.createTransaction({
      amount: tx.getAmount().subtract(fee).toString(),
      address: refundAddress,
    });

    await this.walletRpc.relayTx(refundTransaction);

    escrow.set({
      status: ESCROW_STATUS.REFUNDED,
      statusDate: new Date(),
    });

    await escrow.save();
  }

  async releaseEscrow(escrow) {
    const { releaseAddress, amountAtomic } = escrow;

    const unlockedBalance = await this.getUnlockedBalance();

    if (unlockedBalance.compare(amountAtomic) < 0) {
      escrow.set({
        status: ESCROW_STATUS.RETRYING,
        statusDate: new Date(),
      });

      await escrow.save();

      throw new Error('Insufficient unlocked balance! Try again later.');
    }

    const transaction = await this.createTransaction({
      amount: amountAtomic.toString(),
      address: releaseAddress,
    });

    const fee = transaction.getFee();

    const releaseAmount = BigInteger.parse(amountAtomic).subtract(fee).toString();

    const releaseTransaction = await this.createTransaction({
      amount: releaseAmount,
      address: releaseAddress,
    });

    escrow.set({
      status: ESCROW_STATUS.RELEASING,
      statusDate: new Date(),
      releaseTxHash: releaseTransaction.getHash(),
      releaseAmount: toFloat(releaseAmount, 4),
      releaseAmountAtomic: releaseAmount.toString(),
      releaseFee: toFloat(releaseTransaction.getFee(), 4),
      releaseFeeAtomic: releaseTransaction.getFee().toString(),
    });

    await escrow.save();

    await this.walletRpc.relayTx(releaseTransaction);
  }
}

module.exports = { Escrow, escrowService: new Escrow() };
