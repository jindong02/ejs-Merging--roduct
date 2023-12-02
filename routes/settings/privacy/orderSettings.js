const orderSettings = async (req, res) => {
  try {
    const { user } = req;
    const { autoDeleteProvidedInfo } = req.body;

    if (!['never', '-1', '1', '3', '7', '30'].includes(autoDeleteProvidedInfo)) throw new Error('Invalid Value');

    user.settings.privateInfoExpiring = autoDeleteProvidedInfo !== 'never' ? autoDeleteProvidedInfo : undefined;

    await user.save();

    req.flash('success', 'Order Settings successfully changed');
    res.redirect('/user/settings/privacy');
  } catch (e) {
    console.log(e);
    res.redirect('/404');
  }
};

module.exports = { orderSettings };
