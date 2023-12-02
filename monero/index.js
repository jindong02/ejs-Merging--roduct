/* eslint-disable class-methods-use-this */
const fetch = require('node-fetch');
const monerojs = require('monero-javascript');

const { BigInteger } = monerojs;

const ATOMIC_UNIT = '1000000000000';

const getExchangeRate = async () => {
  const response = await fetch(
    'https://min-api.cryptocompare.com/data/price?fsym=XMR&tsyms=USD',
  );

  if (response.status !== 200) {
    throw new Error('Error getting exchange rate');
  }

  const data = await response.json();

  return data.USD;
};

// Convert from atomic units to XMR float
const toFloat = (amount, precision) => {
  const roundUnit = BigInteger.parse(ATOMIC_UNIT).divide(10 ** precision);

  const floatAmount = BigInteger.parse(amount).divide(roundUnit).toJSValue();

  return floatAmount / 10 ** precision;
};

const connectToMonero = async ({ address, username, password }) => {
  const walletRpc = await monerojs.connectToWalletRpc(
    address,
    username,
    password,
  );

  return walletRpc;
};

const connectToWallet = async ({ walletRpc, name, pass }) => {
  try {
    const wallet = await walletRpc.createWallet({
      path: name,
      password: pass,
    });

    return wallet;
  } catch (err) {
    if (err.message.includes('Wallet already exists')) {
      const wallet = await walletRpc.openWallet(name, pass);

      return wallet;
    }

    throw err;
  }
};

const getAccount = async ({ walletRpc }) => {
  const account = await walletRpc.getAccount(0);

  return account;
};

const createAccount = async ({ walletRpc }) => {
  const account = await walletRpc.createAccount();

  return account;
};

const createOrGetAccount = async ({ walletRpc }) => {
  try {
    const account = await createAccount({ walletRpc });

    return account;
  } catch (err) {
    const account = await getAccount({ walletRpc });

    return account;
  }
};

module.exports = {
  ATOMIC_UNIT,
  toFloat,
  connectToMonero,
  connectToWallet,
  getAccount,
  createAccount,
  createOrGetAccount,
  getExchangeRate,
};
