const bcrypt = require('bcrypt');
const passport = require('passport');
const User = require('../models/user');

exports.join = async (req, res, next) => {
  const { email, nick, password } = req.body;
  try {
    const exUser = await User.findOne({ where: { email } });
    if (exUser) {
      return res.redirect('/join?error=exist');
    }
    // 비밀번호 암호화, 두번째 인수는 12 ~ 31 중에 지정
    const hash = await bcrypt.hash(password, 12);
    await User.create({
      email,
      nick,
      password: hash,
    });
    return res.redirect('/');
  } catch (error) {
    console.error(error);
    return next(error);
  }
}

exports.login = (req, res, next) => {
  // 첫 번째 인수 'local'은 로컬 로그인 전략을 의미하며 전략 성공 또는 실패 시 두 번째 인수의 콜백함수 실행
  passport.authenticate('local', (authError, user, info) => {
    // 서버 에러
    if (authError) {
      console.error(authError);
      return next(authError);
    }
    // 비밀번호 불일치 또는 가입되지 않은 회원
    if (!user) {
      return res.redirect(`/?loginError=${info.message}`);
    }
    // 가입된 회원 && 비밀번호 일치
    // passport.serializeUser 호출 및 connect.sid 세션 쿠키 브라우저에 전송
    return req.login(user, (loginError) => {
      if (loginError) {
        console.error(loginError);
        return next(loginError);
      }
      return res.redirect('/');
    });
  })(req, res, next);
}

exports.logout = (req, res) => {
  req.logout(() => {
    res.redirect('/');
  });
}