const { ORDER_STATUS } = require('../../constants/orderStatus');
const { OrderModel } = require('../../models/order');

const submitOrderInfo = async (req, res) => {
  try {
    const { user } = req;
    const { content } = req.body;

    const order = await OrderModel.findById(req.params.id);
    order.isBuyer(user.username);

    if (order.orderStatus !== ORDER_STATUS.AWAITING_INFORMATION) throw Error('Invalid Order Status');

    order.addBuyerInformation(content);
    order.continueOrder(user.username);

    await order.save();

    res.redirect(`/pay/${order.id}`);
  } catch (e) {
    req.flash('error', e.message);
    res.redirect(`/submit-info/${req.params.id}`);
  }
};

module.exports = { submitOrderInfo };
