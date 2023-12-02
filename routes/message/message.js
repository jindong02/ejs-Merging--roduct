const { ConversationModel } = require('../../models/conversation');
const { deleteExpiredUncoveredIds } = require('../../middlewares/function');

const createMessage = async (req, res) => {
  try {
    const { id } = req.params;

    req.conversation = await ConversationModel.findById(id);

    const { user, conversation } = req;
    const { command } = req.body;
    const hiddenConversationsId = req.session.hiddenConversationsId = deleteExpiredUncoveredIds(req.session.hiddenConversationsId);
    const userId = conversation.settings.conversationPassword && hiddenConversationsId && hiddenConversationsId.map((elem) => elem.convoId).includes(conversation.id) && conversation.users[1].userId !== user.id ? conversation.users[0].userId : user.id;

    switch (command[0]) {
      case 'msg':
        conversation.createNewMessage({
          content: command[1],
          sender: userId,
          expiringInDays: user.settings.messageSettings.messageExpiryDate,
        });
        break;
      case 'edit':
        conversation.editMessage(command[2], command[1], userId);
        break;
      case 'reply':
        conversation.createNewMessage({
          content: command[2],
          sender: userId,
          expiringInDays: user.settings.messageSettings.messageExpiryDate,
          reply: command[1],
        });
        break;
      case 'delete':
        conversation.deleteMessage(command[1], userId);

        res.redirect(`/user/messages?id=${conversation.id}#bottom`);
        return;
    }

    await conversation.save();

    res.redirect(`/user/messages?id=${conversation.id}#bottom`);
  } catch (e) {
    console.log(e);
    res.redirect(`/user/messages?id=${req.conversation.id}#bottom`);
  }
};

module.exports = { createMessage };
