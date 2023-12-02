const express = require('express');

const { isAuth } = require('../../../middlewares/authentication');
const {
  sanitizeQuerys,
  sanitizeParamsQuerys,
} = require('../../../middlewares/validation');

const router = express.Router();

const { archiveFeedback } = require('./archiveFeedback');
const { deleteFeedback } = require('./deleteFeedback');
const { filterFeedbacks } = require('./filterFeedbacks');

const { getFeedbacks } = require('./getFeedbacks');

router.post('/archive-feedback/:id', [isAuth, sanitizeParamsQuerys], archiveFeedback); // isAdmin
router.post('/delete-feedback/:id', [isAuth, sanitizeParamsQuerys], deleteFeedback); // isAdmin
router.post('/feedback-filter', [isAuth, sanitizeQuerys], filterFeedbacks); // isAdmin

router.get('/admin/feedback', [isAuth, sanitizeQuerys], getFeedbacks); // isAdmin

module.exports = router;
