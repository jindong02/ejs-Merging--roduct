const bcrypt = require('bcrypt');
const { UserModel } = require('../../models/user');
const { StepVerificationModel } = require('../../models/2step-verification');
const { generateRandomString, randomListOfWords } = require('../../middlewares/function');
const { send2FACode, encrypt } = require('../../utils');

async function create2StepVerification(
  username,
  type,
  { email, pgpPublicKey },
) {
  await StepVerificationModel.deleteMany({ username });

  if (type === 'email') {
    const code = generateRandomString(9, 'Int');

    const stepVerification = new StepVerificationModel({
      username,
      type,
      code,
    });
    await stepVerification.save();

    send2FACode(email, code).catch((err) => {
      console.log('Failed to send mail', err);
    });

    return `/2fa?type=${type}`;
  }

  const code = randomListOfWords(12);
  const encryptedCode = await encrypt(pgpPublicKey, code);

  const stepVerification = new StepVerificationModel({
    username,
    type,
    code,
    encrypted_code: Buffer.from(encryptedCode).toString('base64'),
  });

  await stepVerification.save();

  return `/2fa?type=${type}&encrypted=${stepVerification.encrypted_code}`;
}

const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const user = await UserModel.findOne({ username });

    if (!user) throw new Error('Username or Password Invalid');
    if (!bcrypt.compareSync(password, user.password)) throw new Error('Username or Password Invalid');

    user.settings.userExpiring ? user.updateInactiveDate() : undefined;
    await user.save();

    if (user.settings.step_verification) {
      res.redirect(
        await create2StepVerification(
          user.username,
          user.settings.step_verification,
          { email: user.email, pgpPublicKey: user.verifiedPgpKeys },
        ),
      );
    } else {
      req.UsertoAuth = user;
      next();
    }
  } catch (e) {
    console.log(e);
    req.flash('error', e.message);
    res.redirect('/login');
  }
};

module.exports = { login };
