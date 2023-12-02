const notifications = async (req, res) => {
  try {
    const { user } = req;

    res.render('Pages/settingsPages/notifications', { userNotifications: user.notifications });

    user.deleteOnSeeNotification();
    user.sawNotification();
    user.save();
  } catch (e) {
    console.log(e);
    res.redirect('/404');
  }
};

module.exports = { notifications };
