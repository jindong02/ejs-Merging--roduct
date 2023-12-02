const bcrypt = require('bcrypt');
const { copyFile } = require('fs');
const { UserModel } = require('../../models/user');
const { generateRandomName } = require('../../middlewares/filesUploads');
const { generateAccountUsername, generateRandomString } = require('../../middlewares/function');

function generateAccountDetailsFlashMessage(username, password) {
  return `
     <p class="mb-0">Account Username: <b>${username}</b></p>
     <p class="mb-0">Password: <b>${password}</b></p>
     <p class="fs-xs mb-0"> <b>Save this somewhere safe</b></p>
     `;
}

function createProfilePicture(name) {
  const randomImgName = generateRandomName(name, 17);
  const imgPath = `/userImg/${randomImgName}`;

  copyFile(
    './public/default/default-profile-pic.png',
    `./uploads${imgPath}`,
    (err) => {
      if (err) throw err;
    },
  );
  return imgPath;
}

function generateAccountPassword(passwordType, typedPassword) {
  switch (passwordType) {
    case 'generate-password':
      return generateRandomString(24);
    case 'choose-password':
      if (!typedPassword || typeof typedPassword !== 'string') throw new Error('The Password fields is Required');
      typedPassword = typedPassword.trim();
      if (typedPassword.length < 8 || typedPassword.length > 200) {
        throw new Error(
          'The Password need to be within 8 to 200 characters longs',
        );
      }
      return typedPassword;
  }
}

const generateAccount = async (req, res) => {
  try {
    const { passwordSettings, password } = req.body;

    const username = generateAccountUsername();

    if (await UserModel.findOne({ username })) throw new Error('This Username is Already Taken');

    const userPassword = generateAccountPassword(passwordSettings, password);

    const user = new UserModel({
      username: generateAccountUsername(),
      password: bcrypt.hashSync(userPassword, 12),
      img_path: createProfilePicture(username),
      settings: {
        userExpiring: 14,
        messageExpiring: 7,
        privateInfoExpiring: 7,
        deleteEmptyConversation: true,
        recordSeeingMessage: false,
      },
    });

    await user.save();

    req.flash(
      'success',
      generateAccountDetailsFlashMessage(user.username, userPassword),
    );
    res.redirect('/login');
  } catch (e) {
    console.log(e);
    req.flash('error', e.message);
    res.redirect('/generate-account');
  }
};

module.exports = { generateAccount };
