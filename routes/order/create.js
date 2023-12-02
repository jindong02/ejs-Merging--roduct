/* eslint-disable global-require */
const {
  BUYER_PRIVATE_INFO_DELETION,
} = require('../../constants/buyerPrivateInfoDeletion');

const { ORDER_STATUS } = require('../../constants/orderStatus');
const { OrderModel } = require('../../models/order');
const { UserModel } = require('../../models/user');
const { getExchangeRate } = require('../../monero/index');
const { escrowService } = require('../../monero/Escrow');

async function getVendorMoneroAddress(vendorUsername) {
  const vendor = await UserModel.findOne({ username: vendorUsername });

  if (vendor.vendorMoneroAddress) return vendor.vendorMoneroAddress;
  throw new Error(
    'Order rejected, because the Vendor doesnt have any monero address.',
  );
}

const buyerPrivateInfoDeletionMap = {
  never: BUYER_PRIVATE_INFO_DELETION.NEVER,
  '-1': BUYER_PRIVATE_INFO_DELETION.INSTANTLY,
  1: BUYER_PRIVATE_INFO_DELETION.DAY,
  3: BUYER_PRIVATE_INFO_DELETION.THREE_DAYS,
  7: BUYER_PRIVATE_INFO_DELETION.WEEK,
  30: BUYER_PRIVATE_INFO_DELETION.MONTH,
};

const createOrder = async (req, res) => {
  try {
    const { product, user } = req;
    const {
      chosenShippingOption,
      chosenSelection1,
      chosenSelection2,
      privacyType,
    } = req.body;
    let { quantity } = req.body;

    if (product.qty_settings.available_qty - quantity < 0) {
      throw new Error('Not enough quantity available');
    }

    if (product.qty_settings.available_qty) {
      product.qty_settings.available_qty -= quantity;
    }

    // need to check if the product is available

    let releaseMoneroAddress = product.customMoneroAddress;

    if (!releaseMoneroAddress) {
      releaseMoneroAddress = await getVendorMoneroAddress(product.vendor);
    }

    const buyerPrivateInfoDeletion = buyerPrivateInfoDeletionMap[user.settings.privateInfoExpiring]
      || BUYER_PRIVATE_INFO_DELETION.INSTANTLY;

    const order = new OrderModel({
      buyer: user.username,
      vendor: product.vendor,
      product: product.id,
      releaseMoneroAddress,
      orderStatus: ORDER_STATUS.AWAITING_INFORMATION,
      timeUntilUpdate: Date.now() + 3 * 60 * 60 * 1000,
      orderDetails: {
        basePrice: product.price,
        quantity,
        chosenShippingOption,
        chosenSelection1,
        chosenSelection2,
      },
      settings: {
        privacyType,
        buyerPrivateInfoDeletion,
      },
    });

    order.calculateTotalOrderPrice();

    if (order.orderDetails.totalPrice < 1) throw new Error('Each orders need to cost at least 1$');

    const currentExchangeRate = await getExchangeRate();
    order.orderDetails.exchangeRate = currentExchangeRate;
    order.orderDetails.xmrPrice = order.orderDetails.totalPrice / currentExchangeRate;

    const escrow = await escrowService.createEscrow({
      amount: order.orderDetails.xmrPrice,
      orderId: order.id,
      releaseAddress: order.releaseMoneroAddress,
    });

    order.orderMoneroAddress = escrow.paymentAddress;

    await product.save();
    await order.save();

    res.redirect(`/submit-info/${order.id}`);
  } catch (e) {
    console.log(e);
    req.flash('error', e.message);
    res.redirect(`/order/${req.product.slug}`);
  }
};

module.exports = { createOrder };
