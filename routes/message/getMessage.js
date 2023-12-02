const { ConversationModel } = require('../../models/conversation');
const { deleteExpiredUncoveredIds } = require('../../middlewares/function');

function getIndexSelectedConversation(conversations, conversationId) {
  const index = conversations.map((conversation) => conversation.id).indexOf(conversationId);

  if (index === -1 && !conversations.length) return -1;
  if (index === -1) return conversations.length - 1;
  return index;
}

const getMessage = async (req, res) => {
  try {
    const { user } = req;
    const id = req.query.id || undefined;

    const hiddenConversationsId = req.session.hiddenConversationsId = deleteExpiredUncoveredIds(req.session.hiddenConversationsId);

    let conversations = await ConversationModel.findAllConversationOfUser({ userId: user.id, populate: 'users.user', ids: hiddenConversationsId });

    const selectedConversation = conversations[getIndexSelectedConversation(conversations, id)];

    if (selectedConversation) {
      await selectedConversation.seeingMessage({ userId: user.id });
    }

    res.render('Pages/messagePages/messages', {
      conversations,
      selectedConversation,
    });
  } catch (e) {
    console.log(e);
    res.redirect('/404');
  }
};

module.exports = { getMessage };
