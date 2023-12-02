const logout = (req, res) => {
  delete req.session.hiddenConversationsId;

  req.logOut();
  res.redirect('/');
};

module.exports = { logout };
