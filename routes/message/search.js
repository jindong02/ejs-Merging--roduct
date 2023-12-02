const bcrypt = require('bcrypt');
const { ConversationModel } = require('../../models/order');

const search = async (req, res) => {
  try {
    const { searchInput } = req.body;

    const conversation = await ConversationModel.findConversationWithId({ id: searchInput[0] });

    if (conversation?.settings.conversationPassword) {
      if (!await bcrypt.compare(searchInput[1], conversation.settings.conversationPassword)) throw new Error('Invalid Password');

      const uncoveredConvo = {
        convoId: conversation.id,
        timeToLive: Date.now() + 600000, // 10 min
      };

      if (!req.session.hiddenConversationsId) req.session.hiddenConversationsId = [];
      req.session.hiddenConversationsId.push(uncoveredConvo);
    }

    res.redirect(`/user/messages?id=${conversation.id}#bottom`);
  } catch (e) {
    console.log(e);
    res.redirect('/user/messages#bottom');
  }
};

module.exports = { search };
