const getGenerateAccount = async (req, res) => {
  try {
    res.render('Pages/authPages/generateAccount');
  } catch (e) {
    console.log(e);
    req.flash('error', 'Unexpected Error, try again');
    res.redirect('/register');
  }
};

module.exports = { getGenerateAccount };
