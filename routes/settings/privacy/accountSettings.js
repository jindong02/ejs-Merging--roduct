const accountSettings = async (req, res) => {
  try {
    const { user } = req;
    const { autoDeleteAccount } = req.body;

    if (!['never', '7', '14', '30', '365'].includes(autoDeleteAccount)) throw new Error('Invalid Value');

    user.settings.userExpiring = autoDeleteAccount !== 'never' ? autoDeleteAccount : undefined;
    user.expire_at = user.settings.userExpiring
      ? user.settings.userExpiring * 86400000 + Date.now()
      : undefined;

    await user.save();

    req.flash('success', 'Account Settings successfully changed');
    res.redirect('/user/settings/privacy');
  } catch (e) {
    console.log(e);
    res.redirect('/404');
  }
};

module.exports = { accountSettings };
