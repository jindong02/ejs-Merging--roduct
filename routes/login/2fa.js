const { StepVerificationModel } = require('../../models/2step-verification');

const fa2 = async (req, res, next) => {
  try {
    const stepVerification = await StepVerificationModel.findOne({
      code: req.body.code,
    }).orFail(new Error('Code Invalid, try Again'));

    req.UsertoAuth = stepVerification.username;
    // Provent Passport Missing credentials Error
    req.body.username = 'username';
    req.body.password = 'password';

    stepVerification.deleteStepVerification();

    next();
  } catch (e) {
    req.flash('error', e.message);
    res.redirect(
      `/2fa?type=${req.query.type}${req.query.encrypted ? `&encrypted=${req.query.encrypted}` : ''
      }`,
    );
  }
};

module.exports = { fa2 };
