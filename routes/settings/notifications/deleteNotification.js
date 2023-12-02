const deleteNotification = async (req, res) => {
  try {
    const { user } = req;
    const { notificationId } = req.params;

    user.deleteNotification({ notificationId });

    await user.save();

    res.redirect('/user/settings/notifications');
  } catch (e) {
    console.log(e);
    req.flash('error', e.message);
    res.redirect('/user/settings/notifications');
  }
};

module.exports = { deleteNotification };
