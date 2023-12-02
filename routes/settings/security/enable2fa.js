const enable2fa = async (req, res) => {
  try {
    const { user } = req;
    const { stepVerification } = req.body;

    switch (stepVerification) {
      case 'email':
        if (user.email_verification_code || !user.email) {
          throw new Error(
            'You need to add/verify your Email address to be able to do that',
          );
        }
        break;
      case 'pgp':
        if (!user.verifiedPgpKeys) {
          throw new Error(
            'You need to add/verify your Pgp key to be able to do that',
          );
        }
        break;
      default:
        throw new Error('Invalid 2 Step Verification');
    }

    user.settings.step_verification = stepVerification;

    await user.save();

    req.flash('success', '2 Step Verification Successfully Activated');
    res.redirect('/user/settings/security');
  } catch (e) {
    req.flash('error', e.message);
    res.redirect('/user/settings/security');
  }
};

module.exports = { enable2fa };
