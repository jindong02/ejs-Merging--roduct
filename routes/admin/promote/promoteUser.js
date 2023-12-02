const { UserModel } = require('../../../models/user');

const promoteUser = async (req, res) => {
  try {
    const user = await UserModel.findOne({ username: req.params.username }).orFail(
      new Error(),
    );

    user.awaiting_promotion = undefined;
    user.authorization = req.query.decline ? 'buyer' : 'vendor';

    await user.save();

    req.flash('success', 'User Sucessfully Promoted');
    res.redirect('/admin/promote-user?usersPage=1');
  } catch (e) {
    console.log(e);
    res.redirect('/404');
  }
};

module.exports = { promoteUser };
