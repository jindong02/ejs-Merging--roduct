const resetPrivacy = async (req, res) => {
  try {
    const { user } = req;
    const { type } = req.query;

    if (!['conversation', 'order', 'account', 'notifications'].includes(type)) throw new Error('Invalid Value');

    switch (type) {
      case 'conversation':
        user.settings.messageSettings.displayUsername = 'ownUsername';
        user.settings.messageSettings.conversationPgp = 'showPgp';
        user.settings.messageSettings.messageExpiryDate = 7;
        user.settings.messageSettings.convoExpiryDate = 180;
        user.settings.messageSettings.includeTimestamps = false;
        user.settings.messageSettings.messageView = false;
        user.settings.messageSettings.deleteEmpty = true;
        break;
      case 'conversation':
        user.settings.userExpiring = undefined;
        user.expire_at = undefined;
        break;
      case 'notifications':
        user.settings.notificationsSettings = {
          recordNotification: true,
          expiryDate: 7,
          sentNotification: {
            orderStatusChange: true,
            newConversation: true,
            changeConversationSettings: true,
            deleteConversation: true,
            siteUpdate: true,
          },
        };
        break;
      default:
        user.settings.privateInfoExpiring = 7;
    }

    await user.save();

    req.flash('success', `Successfully reset your ${type} settings`);
    res.redirect('/user/settings/privacy');
  } catch (e) {
    console.log(e);
    res.redirect('/404');
  }
};

module.exports = { resetPrivacy };
