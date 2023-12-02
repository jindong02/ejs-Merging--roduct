const { OrderModel } = require('../../../models/order');

const takeDispute = async (req, res) => {
  try {
    const order = await OrderModel.findById(req.params.id).orFail(
      new Error(),
    );

    order.disputesSettings = {
      disputeAdmin: req.user.username,
    };

    await order.save();

    res.redirect('/admin/disputes?disputesPage=1');
  } catch (e) {
    console.log(e);
    res.redirect('/404');
  }
};

module.exports = { takeDispute };
