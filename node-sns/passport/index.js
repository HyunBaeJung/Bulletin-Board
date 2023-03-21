const passport = require('passport');
const local = require('./localStrategy');
// const kakao = require('./kakaoStrategy');
const User = require('../models/user');

module.exports = () => {
  // 로그인 시 실행, req.session 객체에 user.id 저장
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // 각 요청마다 실행, 매개변수 id는 serializeUser의 user.id
  // 팔로워와 팔로잉 목록도 함께 저장
  passport.deserializeUser((id, done) => {
    User.findOne({
      where: { id },
      include: [{
        model: User,
        attributes: ['id', 'nick'],
        as: 'Followers',
      }, {
        model: User,
        attributes: ['id', 'nick'],
        as: 'Followings',
      }],
    })
      .then(user => done(null, user))
      .catch(err => done(err));
  });

  local();
  // kakao();
};