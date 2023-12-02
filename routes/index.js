const express = require('express');

const router = express.Router();

const loginRouter = require('./login');
const profileRouter = require('./profile');
const productsRouter = require('./product');
const errorRouter = require('./error');
const messageRouter = require('./message');
const orderRouter = require('./order');
const reviewRouter = require('./review');
const settingsRouter = require('./settings');
const adminRouter = require('./admin');
const docs = require('./docs');

router.use('/', loginRouter);
router.use('/', profileRouter);
router.use('/', productsRouter);
router.use('/', errorRouter);
router.use('/', messageRouter);
router.use('/', orderRouter);
router.use('/', reviewRouter);
router.use('/', settingsRouter);
router.use('/', adminRouter);
router.use('/', docs);

module.exports = router;
