const get2fa = async (req, res) => {
  try {
    res.render('Pages/authPages/stepVerification');
  } catch (e) {
    console.log(e);
    req.flash('error', 'An Error as occur Please Try Again');
    res.redirect('/login');
  }
};

module.exports = { get2fa };
