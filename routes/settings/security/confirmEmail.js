const confirmEmail = async (req, res) => {
  try {
    const { user } = req;
    const confirmationCode = req.body.confirmation_code.trim();

    if (
      typeof confirmationCode !== 'string'
        || confirmationCode.length !== 6
        || user.email_verification_code !== confirmationCode
    ) throw new Error('Invalid Confirmation Code, try Again');

    user.email_verification_code = undefined;

    await user.save();

    req.flash('success', 'Email Successfully Verified');
    res.redirect('/user/settings/security');
  } catch (e) {
    req.flash('error', e.message);
    res.redirect('/user/settings/security');
  }
};

module.exports = { confirmEmail };
