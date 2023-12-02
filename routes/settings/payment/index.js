const express = require('express');

const { isAuth } = require('../../../middlewares/authentication');
const { sanitizeQuerys } = require('../../../middlewares/validation');

const router = express.Router();

const { deleteXmrAddress } = require('./deleteXmrAddress');
const { xmrAddress } = require('./xmrAddress');
const { xmrRefundAddress } = require('./xmrRefundAddress');

const { payment } = require('./payment');

router.post('/delete-address', [isAuth, sanitizeQuerys], deleteXmrAddress);
router.post('/add-xmr-address', [isAuth], xmrAddress);
router.post('/add-xmr-refund-address', [isAuth], xmrRefundAddress);

router.get('/user/settings/payment', [isAuth], payment);

module.exports = router;
