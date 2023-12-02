const fs = require('fs');
const path = require('path');
const openpgp = require('openpgp');

const main = async () => {
  const privateKeyArmored = fs.readFileSync(
    path.join(__dirname, 'private.key'),
    'utf8',
  );

  const privateKey = await openpgp.decryptKey({
    privateKey: await openpgp.readPrivateKey({ armoredKey: privateKeyArmored }),
    passphrase: 'super long and hard to guess secret',
  });

  const encryptedMessage = fs.readFileSync(
    path.join(__dirname, 'encrypted.txt'),
    'utf8',
  );

  const message = await openpgp.readMessage({
    armoredMessage: encryptedMessage,
  });

  const { data: decrypted } = await openpgp.decrypt({
    message,
    decryptionKeys: privateKey,
  });

  console.log(decrypted);
};

main();
