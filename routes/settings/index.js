const express = require('express');

const router = express.Router();

const notificationsRouter = require('./notifications');
const paymentRouter = require('./payment');
const privacyRouter = require('./privacy');
const savedProductsRouter = require('./savedProducts');
const securityRouter = require('./security');

router.use('/', notificationsRouter);
router.use('/', paymentRouter);
router.use('/', privacyRouter);
router.use('/', savedProductsRouter);
router.use('/', securityRouter);

module.exports = router;
