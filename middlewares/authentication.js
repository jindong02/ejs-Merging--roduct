function isAuth(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  console.log('You need to login');

  req.session.previousUrl = req.url;
  res.redirect('/login');
}

function isntAuth(req, res, next) {
  if (req.isAuthenticated()) {
    console.log('you are already auth');
    return res.redirect('/');
  }
  next();
}

function isBuyer(req, res, next) {
  if (req.user.authorization === 'buyer') {
    next(); return;
  }

  console.log('You need to be a buyer to perform this action');
  res.redirect(`/user/profile/${req.user.username}?productPage=1&reviewPage=1`);
}

function isVendor(req, res, next) {
  if (req.user.authorization === 'vendor') {
    next(); return;
  }

  console.log('You need to be a Vendor to perform this action');
  res.redirect(`/user/profile/${req.user.username}?productPage=1&reviewPage=1`);
}

function isAdmin(req, res, next) {
  if (req.user.authorization === 'admin') {
    next(); return;
  }

  console.log('You need to be an Admin to perform this action');
  res.redirect(`/user/profile/${req.user.username}?productPage=1&reviewPage=1`); // change that
}

module.exports = {
  isAuth, isntAuth, isBuyer, isVendor, isAdmin,
};
