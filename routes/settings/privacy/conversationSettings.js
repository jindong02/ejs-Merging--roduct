const conversationSettings = async (req, res) => {
  try {
    const { user } = req;
    const {
      displayUsername,
      conversationPgp,
      messageExpiryDate,
      convoExpiryDate,
      includeTimestamps,
      messageView,
      deleteEmpty,
      customUsername,
      customPgp,
    } = req.body;

    user.settings.messageSettings.displayUsername = displayUsername;
    user.settings.messageSettings.conversationPgp = conversationPgp;
    user.settings.messageSettings.messageExpiryDate = messageExpiryDate;
    user.settings.messageSettings.convoExpiryDate = convoExpiryDate;
    user.settings.messageSettings.includeTimestamps = includeTimestamps || undefined;
    user.settings.messageSettings.messageView = messageView || undefined;
    user.settings.messageSettings.deleteEmpty = deleteEmpty || undefined;

    user.settings.messageSettings.customUsername = customUsername || undefined;
    user.settings.messageSettings.customPgp = customPgp || undefined;

    await user.save();

    req.flash('success', 'Default Conversation Settings successfully changed');
    res.redirect('/user/settings/privacy');
  } catch (e) {
    console.log(e);
    res.redirect('/404');
  }
};

module.exports = { conversationSettings };
