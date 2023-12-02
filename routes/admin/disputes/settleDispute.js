const { OrderModel } = require('../../../models/order');

const settleDispute = async (req, res) => {
  try {
    const { id } = req.params;
    const { winner } = req.body;

    console.log(winner);

    const order = await OrderModel.findById(id).orFail(new Error());

    if (order.disputesSettings.disputeAdmin !== req.user.username) throw new Error('Cant Access');

    let disputeWinner;
    if (winner === 'Both') disputeWinner = winner;
    else if (winner === order.vendor) disputeWinner = order.vendor;
    else disputeWinner = order.buyer;

    order.orderStatus = 'DISPUTED';
    order.timeUntilUpdate = Date.now() + 172800000;
    order.disputesSettings.disputeWinner = disputeWinner;
    order.disputesSettings.disputeAdmin = undefined;

    // Take Action depending on Winner (Ex: Give Refund etc...)

    await order.save();

    req.flash('success', 'Dispute Successfully Settle');
    res.redirect('/admin/disputes?disputesPage=1&adminDispute=true');
  } catch (e) {
    console.log(e);
    res.redirect('/404');
  }
};

module.exports = { settleDispute };
