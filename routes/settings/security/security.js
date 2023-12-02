const security = async (req, res) => {
  try {
    res.render('Pages/settingsPages/security');
  } catch (e) {
    console.log(e);
    res.redirect('/user/settings/security');
  }
};

module.exports = { security };
