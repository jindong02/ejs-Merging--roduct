const { UserModel } = require('../models/user');

function expireAtNotifications(days) {
  if (!days) return;
  if (days < 0) return -1;
  return Date.now() + 86400000 * days;
}

function createNewNotification({
  notifications, notificationType, notificationData, userSettings,
}) {
  const newNotification = {
    type: notificationType,
    data: notificationData,
    seen: userSettings.seen ? false : undefined,
    expireAt: expireAtNotifications(userSettings.expiryDate),
  };

  notifications.unshift(newNotification);
  notifications.splice(100, 1); // Delete 100 notification

  return notifications;
}

async function sendNotification({
  userId,
  notificationType,
  notificationData,
}) {
  if (!userId || !notificationType) return console.log('Missing Information');

  const foundUser = await UserModel.findById(userId);

  if (!foundUser) return console.log('No User Found');

  if (foundUser.settings.notificationsSettings.sendNotification && foundUser.settings.notificationsSettings.sendNotification[notificationType]) {
    foundUser.notifications = createNewNotification({
      notifications: foundUser.notifications,
      notificationType,
      notificationData,
      userSettings: foundUser.settings.notificationsSettings,
    });

    foundUser.save();
  }
}

module.exports = { sendNotification };
