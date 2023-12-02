const payment = async (req, res) => {
  try {
    res.render('Pages/settingsPages/payment');
  } catch (e) {
    console.log(e);
    res.redirect('/user/settings/payment');
  }
};

module.exports = { payment };
