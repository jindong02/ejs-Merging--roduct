const { OrderModel } = require('../../models/order');

const updateOrder = async (req, res) => {
  try {
    const { user } = req;

    const {
      ordersPage, status, clientsOrders, fromOrders,
    } = req.query;

    let order = await OrderModel.findById(req.params.id);

    switch (req.body.status) {
      case 'next':
        order.continueOrder(user.username);
        break;
      case 'resetTimer':
        order.resetTimer(user.username);
        break;
      case 'cancel':
        order.cancelOrder(user.username, req.body.reason);
        break;
      case 'dispute':
        order.startDispute(user.username, req.body.reason);
        break;
      case 'delete':
        order.wantDeleteOrder(user.username);
        break;
      case 'forceDelete':
        order.forceDeleteOrder(user.username);
        break;
      default:
        throw Error('Invalid Status Update');
    }

    if (req.body.status !== 'delete') await order.save();

    let redirectUrl;
    if (!fromOrders) {
      if (req.body.status === 'delete') redirectUrl = '/orders?ordersPage=1';
      else redirectUrl = `/order-resume/${req.params.id}`;
    } else {
      redirectUrl = `/orders?ordersPage=${ordersPage || '1'}${
        status ? `&status=${status}` : ''
      }${clientsOrders ? '&clientsOrders=true' : ''}`;
    }

    res.redirect(redirectUrl);
  } catch (e) {
    console.log(e);
    res.redirect('/404');
  }
};

module.exports = { updateOrder };
