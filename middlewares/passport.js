const LocalStrategy = require('passport-local').Strategy;
const { UserModel } = require('../models/user');

module.exports = function (passport) {
  passport.use(
    new LocalStrategy({ passReqToCallback: true }, async (req, username, password, done) => {
      if (!req.UsertoAuth) return done(null, false, { message: 'No User to Authenticate' });

      if (typeof (req.UsertoAuth) === 'string') {
        req.UsertoAuth = await UserModel.findOne({ username: req.UsertoAuth });
        if (!req.UsertoAuth) return done(null, false, { message: 'Invalid Username' });
      }

      return done(null, req.UsertoAuth);
    }),
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    UserModel.findById(id, (err, user) => {
      done(err, user);
    });
  });
};
