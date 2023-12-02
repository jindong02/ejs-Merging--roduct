const qs = require('qs');

const filterOrders = async (req, res) => {
  try {
    const { status, clientsOrders } = req.body;

    const queryString = qs.stringify({
      ordersPage: 1,
      status: status === 'all' ? undefined : status,
      clientsOrders: clientsOrders === 'true' ? 'true' : undefined,
    });

    res.redirect(`/orders?${queryString}`);
  } catch (e) {
    console.log(e);
    res.redirect('/404');
  }
};

module.exports = { filterOrders };
