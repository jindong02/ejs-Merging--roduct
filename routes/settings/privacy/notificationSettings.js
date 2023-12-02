const notificationSettings = async (req, res) => {
  try {
    const { user } = req;
    const {
      recordNotification, expiryDateNotification, seen, sendNotification,
    } = req.body;

    let flashMessage;

    if (recordNotification) {
      flashMessage = 'Notification Settings Successfully Changed';

      user.settings.notificationsSettings.recordNotification = recordNotification;
      user.settings.notificationsSettings.expiryDate = expiryDateNotification;
      user.settings.notificationsSettings.seen = seen;
      user.settings.notificationsSettings.sendNotification = sendNotification;
    } else {
      flashMessage = 'Notification successfully disabled';

      user.settings.notificationsSettings = undefined;
    }

    await user.save();

    req.flash('success', flashMessage);
    res.redirect('/user/settings/privacy');
  } catch (e) {
    console.log(e);
    req.flash('error', 'There as been an Error, please try again');
    res.redirect('/user/settings/privacy');
  }
};

module.exports = { notificationSettings };
