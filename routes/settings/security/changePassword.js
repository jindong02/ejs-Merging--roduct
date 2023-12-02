const bcrypt = require('bcrypt');

const changePassword = async (req, res) => {
  try {
    const { user } = req;
    const { password, newPassword } = req.body;

    if (!bcrypt.compareSync(password, user.password)) throw new Error('Invalid Password');

    user.password = await bcrypt.hash(newPassword, 10);

    await user.save();

    req.flash('success', 'Password Successfully Changed');
    res.redirect('/user/settings/security');
  } catch (e) {
    req.flash('error', e.message);
    res.redirect('/user/settings/security');
  }
};
module.exports = { changePassword };
