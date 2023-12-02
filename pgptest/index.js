const fs = require('fs');
const path = require('path');
const openpgp = require('openpgp');

// you can remove this folder if you want
// it's just for generating a key pair for testing purposes

const main = async () => {
  // generate a new key pair

  const { privateKey, publicKey } = await openpgp.generateKey({
    userIDs: [{ name: 'Jon Smith', email: 'jon@example.com' }], // you can pass multiple user IDs
    passphrase: 'super long and hard to guess secret', // protects the private key
  });

  // save the private key to a file
  fs.writeFileSync(path.join(__dirname, 'private.key'), privateKey);

  // save the public key to a file
  fs.writeFileSync(path.join(__dirname, 'public.key'), publicKey);
};

main();
