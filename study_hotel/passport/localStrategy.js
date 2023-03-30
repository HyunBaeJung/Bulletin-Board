const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const User = require('../models/user');

module.exports = () => {
  passport.use(new LocalStrategy({
    // input 태그의 name 속성의 값을 각각에 대입
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: false,
  }, async (email, password, done) => {
    try {
      const exUser = await User.findOne({ where: { email } });
      if (exUser) {
        // 비밀번호 일치 여부 확인
        const result = await bcrypt.compare(password, exUser.password);
        // 비밀번호 일치 시 auth.js의 login 컨트롤러의 두 번째 인수(user)로 exUser 대입
        if (result) {
          done(null, exUser);
        // 비밀번호 불일치 시 login 컨트롤러의 각 매개변수에 아래와 같은 값을 대입
        } else {
          done(null, false, { message: '비밀번호 불일치' });
        }
      // 존재하지 않는 회원인 경우 login 컨트롤러의 각 매개변수에 아래와 같은 값을 대입
      } else {
        done(null, false, { message: '가입되지 않은 회원' });
      }
    } catch (error) {
      console.error(error);
      done(error);
    }
  }));
};