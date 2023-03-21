const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const User = require('../models/user');

module.exports = () => {
  // 첫 번째 인수: 전략에 관한 설정을 위한 객체
  // usernameField와 passwordField에는 req.body의 속성명을 대입
  passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: false,
  }, async (email, password, done) => {
    try {
      const exUser = await User.findOne({ where: { email } });
      // 가입된 회원인 경우
      if (exUser) {
        // 입력한 비밀번호(req.body.password?)와 데이터베이스에 저장된 암호화된 비밀번호의 일치 여부
        const result = await bcrypt.compare(password, exUser.password);
        // 비밀번호 일치
        if (result) {
          done(null, exUser);
        // 비밀번호 불일치
        } else {
          done(null, false, { message: '비밀번호가 일치하지 않습니다.' });
        }
      // 가입되지 않은 회원인 경우
      } else {
        done(null, false, { message: '가입되지 않은 회원입니다.' });
      }
    } catch (error) {
      console.error(error);
      done(error);
    }
  }));
};