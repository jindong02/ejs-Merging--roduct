const express = require('express');

const { isAuth } = require('../../../middlewares/authentication');
const { validateMessageSettings, validateNotificationSettings, sanitizeQuerys } = require('../../../middlewares/validation');

const router = express.Router();

const { accountSettings } = require('./accountSettings');
const { conversationSettings } = require('./conversationSettings');
const { orderSettings } = require('./orderSettings');
const { notificationSettings } = require('./notificationSettings');
const { resetPrivacy } = require('./resetPrivacy');

const { privacy } = require('./privacy');

router.post('/order-settings', [isAuth], orderSettings);
router.post('/notifications-settings', [isAuth, validateNotificationSettings], notificationSettings);
router.post('/account-settings', [isAuth], accountSettings);
router.post('/conversation-settings', [isAuth, validateMessageSettings], conversationSettings);
router.post('/reset-privacy', [isAuth, sanitizeQuerys], resetPrivacy);

router.get('/user/settings/privacy', [isAuth], privacy);

module.exports = router;
