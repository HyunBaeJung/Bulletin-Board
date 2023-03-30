const express = require('express');
const passport = require('passport');

const { isLoggedIn, isNotLoggedIn } = require('../middlewares');
const { join, login, logout } = require('../controllers/auth');

const router = express.Router();

// POST /auth/join
router.post('/join', isNotLoggedIn, join);

// POST /auth/login
router.post('/login', isNotLoggedIn, login);

// GET /auth/logout
router.get('/logout', isLoggedIn, logout);

/*

// GET /auth/kakao
router.get('/kakao', passport.authenticate('kakao'));

// GET /auth/kakao/callback
router.get('/kakao/callback', passport.authenticate('kakao', {
  // 로그인 실패 시 이동할 리액트의 라우트 주소(리액트 앱에 요청)
  failureRedirect: '/page/login/fail?loginError=카카오로그인실패',
}), (req, res) => {
  res.send('카카오 로그인 성공');
});

// GET /auth/naver
router.get('/naver', passport.authenticate('naver'));

// GET /auth/naver/callback
router.get('/naver/callback', passport.authenticate('naver', {
  failureRedirect: 'page/login/fail?loginError=네이버로그인실패',
}, (req, res) => {
  res.send('네이버 로그인 성공');
}));

// GET /auth/google
router.get('/google', passport.authenticate('google'));

// GET /auth/google/callback
router.get('/google/callback', passport.authenticate('google', {
  //
  failureRedirect: 'page/login/fail?loginError=구글로그인실패',
}), (req, res) => {
  res.send('구글 로그인 성공');
});

*/

module.exports = router;