const { ConversationModel } = require('../../models/conversation');

const getChangeUserSettings = async (req, res) => {
  try {
    const { id } = req.params;

    req.conversation = await ConversationModel.findById(id).populate('users.user');

    const { conversation } = req;

    res.render('Pages/messagePages/changeUserSettings', { conversation });
  } catch (e) {
    console.log(e);
    res.redirect(`/user/messages?id=${req.conversation.id}#bottom`);
  }
};

module.exports = { getChangeUserSettings };
