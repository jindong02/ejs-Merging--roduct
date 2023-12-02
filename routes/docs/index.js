const express = require('express');

const { validateContactUs } = require('../../middlewares/validation');

const router = express.Router();

const { contactUs } = require('./contactUs');

const { home } = require('./home');
const { news } = require('./news');
const { docs } = require('./docs');
const { getContactUs } = require('./getContactUs');

router.post('/contactus', [validateContactUs], contactUs);

router.get('/', home);
router.get('/news', news);
router.get('/docs', docs);
router.get('/contactus', getContactUs);

module.exports = router;
