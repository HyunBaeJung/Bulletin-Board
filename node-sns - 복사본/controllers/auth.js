const bcrypt = require('bcrypt');
const passport = require('passport');
const User = require('../models/user');



//////////////////////////////////////////// test ///////////////////////////////////////////

exports.getLogin = async (req, res, next) => {
  try {
    res.send(`이메일이 ${req.query.emailName}, 비밀번호가 ${req.query.passwordName} 맞나요???`);
  } catch (error) {
    console.log(error);
    next(error);
  }
}
// test post
exports.postLogin = async (req, res, next) => {
  try {
    return res.send(`이메일이 ${req.body.emailName}, 비밀번호가 ${req.body.passwordName} 맞나요???`);
  } catch (error) {
    console.log(error);
    return next(error);
  }
}

//////////////////////////////////////////// test ///////////////////////////////////////////



exports.join = async (req, res, next) => {
  const { email, nick, password } = req.body;
  try {
    const exUser = await User.findOne({ where: { email } });
    if (exUser) {
      return res.send('authJoin');
      // return res.redirect('/join?error=exist');
    }
    const hash = await bcrypt.hash(password, 12);
    await User.create({
      email,
      nick,
      password: hash,
    });
    return res.send('authJoin');
    // return res.redirect('/');
  } catch (error) {
    console.error(error);
    return next(error);
  }
}

exports.login = (req, res, next) => {
  passport.authenticate('local', (authError, user, info) => {
    if (authError) {
      console.error(authError);
      return next(authError);
    }
    if (!user) {
      return res.send('authLogin');
      // return res.redirect(`/?loginError=${info.message}`);
    }
    return req.login(user, (loginError) => {
      if (loginError) {
        console.error(loginError);
        return next(loginError);
      }
      return res.send('authLogin');
      // return res.redirect('/');
    });
  })(req, res, next);
}

exports.logout = (req, res) => {
  req.logout(() => {
    return res.send('authLogout');
    // res.redirect('/');
  });
}