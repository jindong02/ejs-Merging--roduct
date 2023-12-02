const deleteXmrAddress = async (req, res) => {
  try {
    const { user } = req;
    const { addressType } = req.query;

    switch (addressType) {
      case 'personal':
        user.vendorMoneroAddress = undefined;
        await user.offlineAllUserProducts();
        req.flash(
          'warning',
          'Your Monero Address as been Deleted, all of your Product with no Custom Monero Address are now Offline',
        );
        break;
      case 'refund':
        user.xmrRefundAddress = undefined;
        req.flash('success', 'Your Refund Address as been Deleted');
        break;
      default:
        throw new Error('Invalid Query');
    }

    await user.save();

    res.redirect('/user/settings/payment');
  } catch (e) {
    req.flash('error', e.message);
    res.redirect('/user/settings/payment');
  }
};

module.exports = { deleteXmrAddress };
