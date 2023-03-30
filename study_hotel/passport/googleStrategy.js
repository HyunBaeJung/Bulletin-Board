/*
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;

const User = require('../models/user');

module.exports = () => {
  passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://yourdomain:3000/auth/google/callback",
    passReqToCallback: true
  }, async (request, accessToken, refreshToken, profile, done) => {
    console.log('google profile', profile);
    try {
      const exUser = await User.findOne({
        where: { snsId: profile.id, provider: 'google' },
      });
      if (exUser) {
        done(null, exUser);
      } else {
        const newUser = await User.create({
          email: profile._join?.goolge_account?.email,
          username: profile.displayname,
          birthday,
          gender,
          address,
          provider: 'google',
          snsId: profile.id,
        });
        done(null, newUser);
      }
    } catch (error) {
      console.error(error);
      done(error);
    }
  }));
};

/*

var GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;

passport.use(new GoogleStrategy({
    clientID:     GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://yourdomain:3000/auth/google/callback",
    passReqToCallback   : true
  },
  function(request, accessToken, refreshToken, profile, done) {
    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return done(err, user);
    });
  }
));

*/