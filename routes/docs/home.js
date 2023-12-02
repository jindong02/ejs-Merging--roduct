const home = async (req, res) => {
  try {
    res.render('Pages/docsErrorPages/home');
  } catch (e) {
    console.log(e);
    res.redirect('/404');
  }
};

module.exports = { home };
