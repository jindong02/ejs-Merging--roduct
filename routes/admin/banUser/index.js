const express = require('express');

const { isAuth } = require('../../../middlewares/authentication');
const {
  sanitizeQuerys,
  sanitizeParamsQuerys,
} = require('../../../middlewares/validation');

const router = express.Router();

const { banUser } = require('./banUser');
const { dismissBanUser } = require('./dismissBanUser');
const { filterBanUser } = require('./filterBanUser');

const { getBanUsers } = require('./getBanUsers');

router.post('/dismiss-ban-request/:id', [isAuth, sanitizeParamsQuerys], dismissBanUser); // isAdmin
router.post('/ban-user-filter', [isAuth, sanitizeQuerys], filterBanUser); // isAdmin
router.post('/ban-user/:id', [isAuth, sanitizeParamsQuerys], banUser); // isAdmin

router.get('/admin/ban-user', [isAuth, sanitizeQuerys], getBanUsers); // isAdmin

module.exports = router;
