const { uploadsFiles } = require('../../middlewares/filesUploads');

const edit = async (req, res) => {
  try {
    const { user } = req;
    const {
      profileImg, job, description, achievement, languages,
    } = req.body;

    if (profileImg) user.img_path = uploadsFiles(profileImg, `./uploads${user.img_path}`, false);

    user.job = job;
    user.description = description;
    user.achievement = achievement;
    user.languages = languages;

    await user.save();

    req.flash('success', 'Profile Successfully Edited');
    res.redirect(`/user/profile/${user.username}?productPage=1&reviewPage=1`);
  } catch (e) {
    console.log(e);
    res.redirect('/404');
  }
};

module.exports = { edit };
