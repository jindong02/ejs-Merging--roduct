const express = require('express');

const router = express.Router();

const disputesRouter = require('./disputes');
const feedbacksRouter = require('./feedbacks');
const promoteRouter = require('./promote');
const reportsRouter = require('./reports');

router.use('/', disputesRouter);
router.use('/', feedbacksRouter);
router.use('/', promoteRouter);
router.use('/', reportsRouter);

module.exports = router;
