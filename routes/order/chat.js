const { OrderModel } = require('../../models/order');

const sendChatToOrder = async (req, res) => {
  try {
    const { user } = req;
    const { newChat } = req.body;

    const order = await OrderModel.findById(req.params.id);
    order.isBuyerOrVendorOrAdmin(user.username);

    order.newChatMessage(newChat, user.username);

    await order.save();

    res.redirect(`/order-resume/${order.id}`);
  } catch (e) {
    console.log(e);
    res.redirect('/404');
  }
};

module.exports = { sendChatToOrder };
