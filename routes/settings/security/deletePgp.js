const { ConversationModel } = require('../../../models/conversation');

async function updateConversationPgp(username, newPgp) {
  const conversations = await ConversationModel.findAllUserConversations(username);

  for (let i = 0; i < conversations.length; i++) {
    conversations[i].updateNewPgp(username, newPgp);
  }
}

const deletePgp = async (req, res) => {
  try {
    const { user } = req;

    user.pgp_keys = undefined;
    user.verifiedPgpKeys = undefined;
    user.pgp_keys_verification_words = undefined;
    user.pgp_keys_verification_words_encrypted = undefined;
    user.settings.step_verification = user.settings.step_verification === 'pgp'
      ? undefined
      : user.settings.step_verification;

    await updateConversationPgp(user.username, undefined);

    await user.save();

    req.flash('success', 'Pgp Keys Successfully Deleted');
    res.redirect('/user/settings/security');
  } catch (e) {
    console.log(e);
    res.redirect('/404');
  }
};

module.exports = { deletePgp };
