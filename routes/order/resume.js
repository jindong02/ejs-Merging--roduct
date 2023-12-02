const { OrderModel } = require('../../models/order');

const orderResume = async (req, res) => {
  try {
    const { user } = req;

    let order = await OrderModel.findById(req.params.id).populate('product');
    order.isBuyerOrVendorOrAdmin(user.username);

    order.hasPermissionToDelete(user.username);
    order.formatTimeLeft();
    order.hideBuyerIdentity();

    res.render('Pages/orderPages/order-resume', { order, product: order.product });
  } catch (e) {
    console.log(e);
    res.redirect('/404');
  }
};

module.exports = { orderResume };
