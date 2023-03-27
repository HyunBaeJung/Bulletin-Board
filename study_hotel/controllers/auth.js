const bcrypt = require('bcrypt');
const passport = require('passport');
const User = require('../models/user');

exports.join = async (req, res, next) => {
  const { email, password, username, birthday, gender, address, mobile_number } = req.body;
  try {
    const exUser = await User.findOne({ where: { email } });
    if (exUser) {
      return res.send('회원가입 실패: 이미 가입된 회원');
    }
    // 각 개인정보 데이터 타입에 맞게 변환하여 저장
    const hash = await bcrypt.hash(password, 12);
    const gend = gender ? 'M' : 'W';
    await User.create({
      email,
      password: hash,
      username,
      birthday,
      gender: gend,
      address,
      mobile_number,
    });
    return res.send('회원가입 성공');
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
      return res.send(`로그인 실패: ${info.message}`);
    }
    return req.login(user, (loginError) => {
      if (loginError) {
        console.error(loginError);
        return next(loginError);
      }
      return res.send('로그인 성공');
    });
  })(req, res, next);
}

exports.logout = (req, res) => {
  req.logout(() => {
    res.send('로그아웃');
  });
}
