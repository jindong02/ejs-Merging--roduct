const { UserModel } = require('../../models/user');
const { ConversationModel } = require('../../models/conversation');

const createHiddenConversation = async (req, res) => {
  try {
    const { id } = req.params;
    const { user } = req;
    const {
      content, conversationId, conversationPassword, displayUsername, conversationPgp, convoExpiryDate, messageExpiryDate,
    } = req.body;

    const conversation = await ConversationModel.findConversationWithId({ id: conversationId });
    if (conversation) throw Error('Invalid Id, Please try a differrent one');

    const newHiddenConversation = new ConversationModel({});
    const otherUser = await UserModel.findById(id);

    newHiddenConversation.updateConversationSettings({
      deleteEmpty: true,
      convoExpiryDate,
    });

    await newHiddenConversation.addConversationPassword({ plainTextPassword: conversationPassword });

    newHiddenConversation.addUser({
      user, customUsername: displayUsername, conversationPgp, isHiddenConverstion: conversationId, isOriginalSender: true,
    });
    newHiddenConversation.addUser({ user: otherUser });

    newHiddenConversation.users[0].messageExpiryDate = messageExpiryDate;

    newHiddenConversation.createNewMessage({
      content,
      sender: conversationId,
      expiringInDays: messageExpiryDate,
    });

    await newHiddenConversation.save();

    req.flash('success', `  
      <p class="mb-0">Hidden Converstion Successfully Created</p>
      <p class="mb-0">Conversation Id: <b>${conversationId}</b></p>
      <p class="fs-xs mb-0"> Save this id and your password somewhere safe and dont lose it, or you will lose access to this conversation</p>
      <a href='/docs/' class="fs-xs">How do I access this conversation ?</a>
      `);
    res.redirect(`/user/create-hidden-conversation?id=${id}`);
  } catch (e) {
    console.log(e);
    req.flash('error', e.message);
    res.redirect(`/user/create-hidden-conversation?id=${req.params.id}`);
  }
};

module.exports = { createHiddenConversation };
