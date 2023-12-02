const { ConversationModel } = require('../../models/conversation');
const { deleteExpiredUncoveredIds } = require('../../middlewares/function');

const changeSettings = async (req, res) => {
  try {
    const { id } = req.params;

    req.conversation = await ConversationModel.findById(id);

    const { user, conversation } = req;
    let {
      includeTimestamps, messageView, deleteEmpty, convoExpiryDate,
    } = req.body;

    const hiddenConversationsId = req.session.hiddenConversationsId = deleteExpiredUncoveredIds(req.session.hiddenConversationsId);
    const userId = conversation.settings.conversationPassword && hiddenConversationsId && hiddenConversationsId.map((elem) => elem.convoId).includes(conversation.id) && conversation.users[1].userId !== user.id ? conversation.users[0].userId : user.id;

    if (conversation.users[0].userId === userId) {
      if (conversation.settings.conversationPassword) {
        includeTimestamps = undefined;
        messageView = undefined;
        deleteEmpty = true;
        convoExpiryDate = !convoExpiryDate || convoExpiryDate < 3 ? 3 : convoExpiryDate || undefined;
      }

      conversation.updateConversationSettings({
        includeTimestamps,
        messageView,
        deleteEmpty,
        convoExpiryDate,
      });

      await conversation.emptyMessage();
    }

    res.redirect(`/user/messages?id=${conversation.id}#bottom`);
  } catch (e) {
    console.log(e);
    res.redirect(`/user/messages?id=${req.conversation.id}#bottom`);
  }
};

module.exports = { changeSettings };
