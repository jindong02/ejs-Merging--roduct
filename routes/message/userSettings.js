const { ConversationModel } = require('../../models/conversation');
const { deleteExpiredUncoveredIds } = require('../../middlewares/function');

const changeUserSettings = async (req, res) => {
  try {
    const { id } = req.params;

    req.conversation = await ConversationModel.findById(id).populate('users.user');

    const { user, conversation } = req;
    const { messageExpiryDate, conversationPgp } = req.body;

    const hiddenConversationsId = req.session.hiddenConversationsId = deleteExpiredUncoveredIds(req.session.hiddenConversationsId);
    const userId = conversation.settings.conversationPassword && hiddenConversationsId && hiddenConversationsId.map((elem) => elem.convoId).includes(conversation.id) && conversation.users[1].userId !== user.id ? conversation.users[0].userId : user.id;

    conversation.updateUserSettings({
      userId,
      messageExpiryDate,
      conversationPgp,
    });

    await conversation.save();

    res.redirect(`/user/messages?id=${conversation.id}#bottom`);
  } catch (e) {
    console.log(e);
    res.redirect(`/user/messages?id=${req.conversation.id}#bottom`);
  }
};

module.exports = { changeUserSettings };
