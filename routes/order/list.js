const { paginatedResults } = require('../../middlewares/function');
const { OrderModel } = require('../../models/order');

function constructOrdersQuery(query, username) {
  let mongooseQuery = {};

  if (query.status) {
    mongooseQuery = {
      ...mongooseQuery,
      orderStatus: query.status,
    };
  }

  if (query.clientsOrders === 'true') {
    mongooseQuery = {
      ...mongooseQuery,
      vendor: username,
    };
  } else {
    mongooseQuery = {
      ...mongooseQuery,
      buyer: username,
    };
  }

  return mongooseQuery;
}

const getOrders = async (req, res) => {
  try {
    const { user, query } = req;

    const mongooseQuery = constructOrdersQuery(query, user.username);

    const orders = await paginatedResults(OrderModel, mongooseQuery, {
      page: query.ordersPage,
      limit: 24,
      populate: 'product',
    });

    orders.results.forEach((order) => {
      order.addRedirectLink(user.username);
      order.hasPermissionToDelete(user.username);
      order.sanitizeBuyerInfoHtml();
      order.formatTimeLeft();
      order.hideBuyerIdentity();
    });

    res.render('Pages/orderPages/your-order', { orders });
  } catch (e) {
    console.log(e);
    res.redirect('/404');
  }
};

module.exports = { getOrders };
