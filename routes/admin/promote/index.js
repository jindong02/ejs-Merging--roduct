const express = require('express');

const { isAuth } = require('../../../middlewares/authentication');
const {
  sanitizeQuerys,
  sanitizeParamsQuerys,
} = require('../../../middlewares/validation');

const router = express.Router();

const { promoteUser } = require('./promoteUser');

const { getPromote } = require('./getPromote');

router.post('/promote-user/:username', [isAuth, sanitizeParamsQuerys], promoteUser); // isAdmin

router.get('/admin/promote-user', [isAuth, sanitizeQuerys], getPromote); // isAdmin

module.exports = router;
