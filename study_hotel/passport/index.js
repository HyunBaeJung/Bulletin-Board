const passport = require('passport');
const local = require('./localStrategy');
const kakao = require('./kakaoStrategy');
const naver = require('./naverStrategy');
const google = require('./googleStrategy');
const User = require('../models/user');

module.exports = () => {
  // req.session에 user.id만 저장하여 세션 생성(세션 스토어에 저장)
  // express-session 설정에 맞게 브라우저에 connect.sid 세션 쿠키 전송
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // 어떤 요청이 들어와 라우터에 도달하기 전에,
  // app.js의 passport.session 미들웨어가 deserializeUser를 호출
  // connect.sid 세션 쿠키를 읽고 세션 스토어에서 세션 객체를 찾아 req.session를 복원함
  // req.session에 저장된 user.id를 인수로 사용하여 사용자 정보 조회
  // 조회된 사용자 정보를 req.user 객체에 저장하여 라우터에서 사용 
  passport.deserializeUser((id, done) => {
    User.findOne({ where: { id } })
      .then(user => done(null, user))
      .catch(err => done(err));
  });

  local();
  kakao();
  naver();
  google();
};