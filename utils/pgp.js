const openpgp = require('openpgp');

const encrypt = async (publicKeyArmored, text) => {
  const publicKey = await openpgp.readKey({ armoredKey: publicKeyArmored });
  const message = await openpgp.createMessage({ text });

  const encrypted = await openpgp.encrypt({
    message,
    encryptionKeys: publicKey,
  });

  return encrypted;
};

// we don't need decrypt function

module.exports = {
  encrypt,
};
