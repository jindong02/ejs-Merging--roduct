const remove2fa = async (req, res) => {
  try {
    const { user } = req;

    user.settings.step_verification = undefined;

    await user.save();

    req.flash('success', '2 Step Verification Successfully Removed');
    res.redirect('/user/settings/security');
  } catch (e) {
    console.log(e);
    res.redirect('/404');
  }
};

module.exports = { remove2fa };
