const { ORDER_STATUS } = require('../../constants/orderStatus');
const { sanitizeHTML } = require('../../middlewares/function');
const { OrderModel } = require('../../models/order');
const { UserModel } = require('../../models/user');

async function getUserVerifiedPgpKeys(username) {
  const vendor = await UserModel.findOne({ username }, 'verifiedPgpKeys');
  return vendor.verifiedPgpKeys;
}

const getOrderInfo = async (req, res) => {
  try {
    const { user } = req;

    const order = await OrderModel.findById(req.params.id).populate('product');

    order.isBuyer(user.username);

    console.log('###', order.orderStatus);

    if (order.orderStatus !== ORDER_STATUS.AWAITING_INFORMATION) throw Error('Invalid Order Status');

    if (order.product.message) order.product.message = sanitizeHTML(order.product.message);

    const vendorPgpKeys = await getUserVerifiedPgpKeys(order.vendor);

    res.render('Pages/orderPages/submit-info', { order, product: order.product, vendorPgpKeys });
  } catch (e) {
    console.log(e);
    res.redirect('/404');
  }
};

module.exports = { getOrderInfo };
