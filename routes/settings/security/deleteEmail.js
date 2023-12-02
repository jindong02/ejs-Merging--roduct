const deleteEmail = async (req, res) => {
  try {
    const { user } = req;

    user.email = undefined;
    user.email_verification_code = undefined;
    user.settings.step_verification = user.settings.step_verification === 'email'
      ? undefined
      : user.settings.step_verification;

    await user.save();

    req.flash('success', 'Email Address Successfully Deleted');
    res.redirect('/user/settings/security');
  } catch (e) {
    console.log(e);
    res.redirect('/404');
  }
};

module.exports = { deleteEmail };
