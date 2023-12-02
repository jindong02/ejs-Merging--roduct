const express = require('express');

const { isAuth } = require('../../../middlewares/authentication');
const {
  validateReports,
  validateResolveReport,
  sanitizeQuerys,
  sanitizeParamsQuerys,
} = require('../../../middlewares/validation');

async function reportHimself(req, res, next) {
  try {
    if (req.params.id === req.user.username) throw new Error('Why do you want to report Yourself ?');
    next();
  } catch (e) {
    req.flash('error', e.message);
    res.redirect(`/user/profile/${req.user.username}?productPage=1&reviewPage=1`);
  }
}

const router = express.Router();

const { archiveReport } = require('./archiveReport');
const { createReport } = require('./createReport');
const { dismissReport } = require('./dismissReport');
const { filterReports } = require('./filterReports');
const { resolveReport } = require('./resolveReport');

const { getReports } = require('./getReports');

router.post('/archive-report/:id', [isAuth, sanitizeParamsQuerys], archiveReport); // isAdmin
router.post('/report/:id', [isAuth, sanitizeParamsQuerys, validateReports, reportHimself], createReport); // isAdmin
router.post('/dismiss-report/:id', [isAuth, sanitizeParamsQuerys], dismissReport); // isAdmin
router.post('/report-filter', [isAuth, sanitizeQuerys], filterReports); // isAdmin
router.post('/resolve-report/:id', [isAuth, sanitizeParamsQuerys, validateResolveReport], resolveReport); // isAdmin

router.get('/admin/reports', [isAuth, sanitizeQuerys], getReports); // isAdmin

module.exports = router;
