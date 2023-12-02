const { isMoneroAddress } = require('../../../middlewares/function');

const xmrAddress = async (req, res) => {
  try {
    const { user } = req;

    const moneroAddress = isMoneroAddress(req.body.vendorMoneroAddress, '');

    const successMessage = user.moneroAddress
      ? 'Monero Address Successfully Changed'
      : 'Monero Address Successfully Added';

    user.vendorMoneroAddress = moneroAddress;

    await user.save();

    req.flash('success', successMessage);
    res.redirect('/user/settings/payment');
  } catch (e) {
    req.flash('error', e.message);
    res.redirect('/user/settings/payment');
  }
};

module.exports = { xmrAddress };
