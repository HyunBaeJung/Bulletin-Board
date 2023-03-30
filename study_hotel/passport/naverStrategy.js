/*
const passport = require('passport');
const NaverStrategy = require('passport-naver').Strategy;

const User = require('../models/user');

module.exports = () => {
  passport.use(new NaverStrategy({
    clientID: config.naver.clientID,
    clientSecret: config.naver.clientSecret,
    callbackURL: config.naver.callbackURL,
  }, async (accessToken, refreshToken, profile, done) => {
    console.log('naver profile', profile);
    try {
      const exUser = await User.findOne({
        where: { snsId: profile.id, provider: 'naver' }
      });
      if (exUser) {
        done(null, exUser);
      } else {
        const newUser = await User.create({
          //
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

var NaverStrategy = require('passport-naver').Strategy;

passport.use(new NaverStrategy({
        clientID: config.naver.clientID,
        clientSecret: config.naver.clientSecret,
        callbackURL: config.naver.callbackURL
    },
    function(accessToken, refreshToken, profile, done) {
        User.findOne({
            'naver.id': profile.id
        }, function(err, user) {
            if (!user) {
                user = new User({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    username: profile.displayName,
                    provider: 'naver',
                    naver: profile._json
                });
                user.save(function(err) {
                    if (err) console.log(err);
                    return done(err, user);
                });
            } else {
                return done(err, user);
            }
        });
    }
));

*/