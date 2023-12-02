const express = require('express');
const passport = require('passport');
const { isntAuth } = require('../../middlewares/authentication');
const { sanitizeLoginInput, sanitizeRegisterInput, sanitizeVerificationCode } = require('../../middlewares/validation');

const authenticateUser = passport.authenticate('local', {
  failureRedirect: '/login',
  failureFlash: true,
});

const redirectUser = (req, res) => {
  if (req.user.authorization === 'admin') return res.redirect('/disputes?disputesPage=1');

  if (!req.session.previousUrl) return res.redirect('/');

  res.redirect(`${req.session.previousUrl}`);
  delete req.session.previousUrl;
};

const router = express.Router();

const { fa2 } = require('./2fa');
const { generateAccount } = require('./generateAccount');
const { login } = require('./login');
const { register } = require('./register');

const { get2fa } = require('./get2fa');
const { getGenerateAccount } = require('./getGenerateAccount');
const { getRegister } = require('./getRegister');
const { getLogin } = require('./getLogin');
const { logout } = require('./logout');

router.post('/2fa', [isntAuth, sanitizeVerificationCode], fa2, authenticateUser, redirectUser);
router.post('/generate-account', [isntAuth], generateAccount);
router.post('/login', [isntAuth, sanitizeLoginInput], login, authenticateUser, redirectUser);
router.post('/register', [isntAuth, sanitizeRegisterInput], register, authenticateUser, redirectUser);

router.get('/2fa', [isntAuth], get2fa);
router.get('/generate-account', [isntAuth], getGenerateAccount);
router.get('/register', [isntAuth], getRegister);
router.get('/login', [isntAuth], getLogin);
router.get('/logout', logout);

module.exports = router;
