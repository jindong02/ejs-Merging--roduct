const express = require('express');

const { isAuth } = require('../../../middlewares/authentication');
const { sanitizeChangePassword } = require('../../../middlewares/validation');

const router = express.Router();

const { deleteUser } = require('./deleteUser');
const { changePassword } = require('./changePassword');
const { deletePgp } = require('./deletePgp');

const { confirmEmail } = require('./confirmEmail');
const { deleteEmail } = require('./deleteEmail');
const { email } = require('./email');
const { enable2fa } = require('./enable2fa');
const { pgpKeys } = require('./pgpKeys');
const { remove2fa } = require('./remove2fa');
const { resendEmail } = require('./resendEmail');
const { verifyPgp } = require('./verifyPgp');

const { security } = require('./security');

router.delete('/delete-user', [isAuth], deleteUser);
router.post('/delete-pgp', [isAuth], deletePgp);
router.put('/change-password', [isAuth, sanitizeChangePassword], changePassword);

router.post('/confirm-email', [isAuth], confirmEmail);
router.post('/delete-email', [isAuth], deleteEmail);
router.post('/add-email', [isAuth], email);
router.post('/enable-2fa', [isAuth], enable2fa);
router.post('/add-pgp', [isAuth], pgpKeys);
router.post('/remove-2fa', [isAuth], remove2fa);
router.post('/resend-email-verification', [isAuth], resendEmail);
router.post('/verify-pgp', [isAuth], verifyPgp);

router.get('/user/settings/security', [isAuth], security);

module.exports = router;
