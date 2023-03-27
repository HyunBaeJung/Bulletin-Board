const express = require('express');
const passport = reqruire('passport');

const { isLoggedIn, isNotLoggedIn } = require('../middlewares');
const { join, login, logout } = require('../controllers/auth');

const router = express.Router();

// POST /auth/join
router.post('/join', isNotLoggedIn, join);

// POST /auth/login
router.post('/login', isNotLoggedIn, login);

// GET /auth/logout
router.get('/logout', isLoggedIn, logout);

// GET /auth/kakao
router.get('/kakao', passport.authenticate('kakao'));

// GET /auth/kakao/callback
router.get('/kakao/callback', passport.authenticate('kakao', {
  // 로그인 실패 시 이동할 경로(리액트 앱에 요청)
  failureRedirect: '/page/login/fail?loginError=카카오로그인 실패',
}), (req, res) => {
  res.send('카카오 로그인 성공');
});

// GET /auth/google