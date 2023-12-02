const { copyFile } = require('fs');

const resetPicture = async (req, res) => {
  try {
    const { user } = req;

    copyFile('./public/default/default-profile-pic.png', `./uploads/${user.img_path}`, (err) => {
      if (err) throw err;
    });

    await user.save();

    req.flash('success', 'Profile Picture Successfully Reseted');
    res.redirect('/user/profile/edit?productPage=1&reviewPage=1');
  } catch (e) {
    console.log(e);
    res.redirect('/404');
  }
};

module.exports = { resetPicture };
