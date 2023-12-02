const { randomListOfWords, isPgpKeys } = require('../../../middlewares/function');
const { encrypt } = require('../../../utils/pgp');

const pgpKeys = async (req, res) => {
  try {
    const { user } = req;

    const pgp = isPgpKeys(req.body.pgp);

    user.pgp_keys = pgp.trim();
    user.verifiedPgpKeys = undefined;
    user.pgp_keys_verification_words = randomListOfWords(12);

    const encryptedVerificationWords = await encrypt(
      user.pgp_keys,
      user.pgp_keys_verification_words,
    );

    user.pgp_keys_verification_words_encrypted = encryptedVerificationWords;

    await user.save();

    req.flash('success', 'A new Pgp Keys as Been added, you just need Verify it');
    res.redirect('/user/settings/security');
  } catch (e) {
    req.flash('error', e.message);
    res.redirect('/user/settings/security');
  }
};

module.exports = { pgpKeys };
