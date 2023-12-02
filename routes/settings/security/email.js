const { isEmail, generateRandomString } = require('../../../middlewares/function');
const { sendVerificationCode } = require('../../../utils/email');

const addEmail = async (req, res) => {
  try {
    const { user } = req;
    const { email } = req.body;

    if (!isEmail(email)) throw new Error('This Email Address is Invalid');

    user.email = email;
    user.email_verification_code = generateRandomString(6, 'Int');

    // Send Email Containning Verification Code
    console.log(`The Verification Code is: ${user.email_verification_code}`);

    await sendVerificationCode(user.email, user.email_verification_code);
    await user.save();

    req.flash('success', 'Email Address Successfully Added');
    res.redirect('/user/settings/security');
  } catch (e) {
    req.flash('error', e.message);
    res.redirect('/user/settings/security');
  }
};

module.exports = { email: addEmail };
