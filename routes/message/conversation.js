const { UserModel } = require('../../models/user');
const { ConversationModel } = require('../../models/conversation');

function conversationAlreadyExist(conversations, userId, otherUserId, displayUsername) {
  for (let i = 0; i < conversations.length; i++) {
    if (!conversations[i].users[0].displayUsername && !displayUsername) {
      if (conversations[i].users[0].userId === userId && conversations[i].users[1].userId === otherUserId) return [conversations[i], 0];
      if (conversations[i].users[1].userId === userId && conversations[i].users[0].userId === otherUserId) return [conversations[i], 1];
    } else if (conversations[i].users[0].userId === userId) {
      if (conversations[i].users[0].displayUsername === displayUsername) {
        return [conversations[i], 0];
      }
    }
  }
  return [new ConversationModel({}), 0];
}

const createConversation = async (req, res) => {
  try {
    const { user } = req;
    const {
      includeTimestamps, messageView, deleteEmpty, convoExpiryDate,
    } = user.settings.messageSettings;
    const {
      content, displayUsername, conversationPgp,
    } = req.body;
    const { id } = req.params;

    if (await ConversationModel.countDocuments({ 'users.userId': user.id }) >= 300) throw new Error('You cant have more than 100 conversation');

    let newConversation = await ConversationModel.findConversationExist({ userId: user.id, id });

    if (newConversation.filter((conversation) => conversation.users[0].userId === user.id || (!conversation.users[0].displayUsername && conversation.users[1].userId === user.id)).length >= 5) throw Error('You cant create more than 5 conversation with each user');

    let [conversation, userPosition] = conversationAlreadyExist(newConversation, user.id, id, displayUsername);

    if (!conversation.users.length) {
      const otherUser = await UserModel.findById(id);
      conversation.updateConversationSettings({
        includeTimestamps,
        messageView,
        deleteEmpty,
        convoExpiryDate,
      });

      conversation.addUser({
        user, customUsername: displayUsername, conversationPgp, isOriginalSender: true,
      });
      conversation.addUser({ user: otherUser });
    }

    conversation.createNewMessage({
      content,
      sender: conversation.users[userPosition].userId,
      expiringInDays: user.settings.messageSettings.messageExpiryDate,
    });

    await conversation.save();

    res.redirect(`/user/messages?id=${conversation.id}#bottom`);
  } catch (e) {
    console.log(e);
    const user = await UserModel.findById(req.params.id);

    req.flash('error', e.message);
    res.redirect(`/user/profile/${user.username}?productPage=1&reviewPage=1`);
  }
};

module.exports = { createConversation };
