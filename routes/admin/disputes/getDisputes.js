const { OrderModel } = require('../../../models/order');
const { formatUsernameWithSettings, paginatedResults } = require('../../../middlewares/function');

function hideBuyerUsername(disputes) {
  for (let i = 0; i < disputes.length; i++) {
    disputes[i].buyer = formatUsernameWithSettings(
      disputes[i].buyer,
      disputes[i].privacy,
    );
  }
  return disputes;
}

const getDisputes = async (req, res) => {
  try {
    const { adminDispute, reason } = req.query;

    const query = reason ? { orderStatus: 'disputeInProgress', 'disputesSettings.disputeReason': reason, 'disputesSettings.disputeAdmin': adminDispute ? req.user.username : undefined } : { orderStatus: 'disputeInProgress', 'disputesSettings.disputeAdmin': adminDispute ? req.user.username : undefined };

    const disputes = await paginatedResults(OrderModel, query, { page: req.query.disputesPage, limit: 24, populate: 'product' });

    disputes.results = hideBuyerUsername(disputes.results);

    res.render('Pages/adminPages/dipsutes', { disputes });
  } catch (e) {
    console.log(e);
    res.redirect('/404');
  }
};

module.exports = { getDisputes };
