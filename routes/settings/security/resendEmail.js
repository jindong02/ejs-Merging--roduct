const { generateRandomString } = require('../../../middlewares/function');
const { sendVerificationCode } = require('../../../utils/email');

const resendEmail = async (req, res) => {
  try {
    const { user } = req;

    if (!user.email || !user.email_verification_code) throw new Error();

    user.email_verification_code = generateRandomString(6, 'Int');

    await sendVerificationCode(user.email, user.email_verification_code);

    // Resend Email with new Confirmation Code

    await user.save();

    req.flash('success', 'Verifaction Code Resended');
    res.redirect('/user/settings/security');
  } catch (e) {
    res.redirect('/user/settings/security');
  }
};

module.exports = { resendEmail };
