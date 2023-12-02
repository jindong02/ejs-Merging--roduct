const { UserModel } = require('../../../models/user');
const { paginatedResults } = require('../../../middlewares/function');

const getPromote = async (req, res) => {
  try {
    const users = await paginatedResults(UserModel, { awaiting_promotion: { $exists: true } }, { page: req.query.usersPage, limit: 24 });

    res.render('Pages/adminPages/promote', { users });
  } catch (e) {
    res.redirect('/404');
  }
};

module.exports = { getPromote };
