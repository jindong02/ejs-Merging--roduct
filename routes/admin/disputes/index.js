const express = require('express');

const { isAuth } = require('../../../middlewares/authentication');
const {
  sanitizeParams,
  sanitizeQuerys,
} = require('../../../middlewares/validation');

const router = express.Router();

const { filterDisputes } = require('./filterDisputes');
const { settleDispute } = require('./settleDispute');
const { takeDispute } = require('./takeDispute');

const { getDisputes } = require('./getDisputes');

router.post('/disputes-filter', [isAuth, sanitizeParams], filterDisputes); // isAdmin
router.post('/settle-dispute/:id', [isAuth, sanitizeParams], settleDispute); // isAdmin
router.post('/disputes/:id', [isAuth, sanitizeParams], takeDispute); // isAdmin

router.get('/admin/disputes', [isAuth, sanitizeQuerys], getDisputes); // isAdmin

module.exports = router;
