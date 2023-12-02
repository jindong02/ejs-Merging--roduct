const deleteUser = async (req, res) => {
  try {
    await req.user.deleteUser();

    req.logOut();
    res.redirect('/login');
  } catch (e) {
    console.log(e);
    res.redirect('/404');
  }
};

module.exports = { deleteUser };
