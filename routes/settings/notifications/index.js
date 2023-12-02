const express = require('express');

const { isAuth } = require('../../../middlewares/authentication');
const { sanitizeParams } = require('../../../middlewares/validation');

const router = express.Router();

const { deleteNotification } = require('./deleteNotification');

const { notifications } = require('./notifications');

router.post('/delete-notification/:notificationId', [isAuth, sanitizeParams], deleteNotification);

router.get('/user/settings/notifications', [isAuth], notifications);

module.exports = router;
