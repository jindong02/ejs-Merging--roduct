const { ConversationModel } = require('../../../models/conversation');

async function updateConversationPgp(username, newPgp) {
  const conversations = await ConversationModel.findAllUserConversations(username);

  for (let i = 0; i < conversations.length; i++) {
    conversations[i].updateNewPgp(username, newPgp);
  }
}

const verifyPgp = async (req, res) => {
  try {
    const { user } = req;
    const { pgpVerification } = req.body;

    if (!pgpVerification) {
      throw new Error('Invalid Code... try Again');
    }

    if (pgpVerification.trim() !== user.pgp_keys_verification_words.trim()) {
      throw new Error('Invalid Code... try Again');
    }

    user.verifiedPgpKeys = user.pgp_keys;
    user.pgp_keys = undefined;
    user.pgp_keys_verification_words = undefined;
    user.pgp_keys_verification_words_encrypted = undefined;

    await updateConversationPgp(user.username, user.verifiedPgpKeys);
    await user.save();

    req.flash('success', 'Pgp Successfully Verified');
    res.redirect('/user/settings/security');
  } catch (e) {
    console.log(e);
    res.redirect('/404');
  }
};

module.exports = { verifyPgp };
