const { isMoneroAddress } = require('../../../middlewares/function');

const xmrRefundAddress = async (req, res) => {
  try {
    const { user } = req;
    const moneroRefundAddress = isMoneroAddress(
      req.body.xmrRefundAddress,
      'Refund',
    );

    const successMessage = user.moneroRefundAddress
      ? 'Monero Address Successfully Changed'
      : 'Monero Address Successfully Added';

    user.xmrRefundAddress = moneroRefundAddress;

    await user.save();

    req.flash('success', successMessage);
    res.redirect('/user/settings/payment');
  } catch (e) {
    req.flash('error', e.message);
    res.redirect('/user/settings/payment');
  }
};

module.exports = { xmrRefundAddress };
