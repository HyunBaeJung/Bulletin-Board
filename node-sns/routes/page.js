const express = require('express');
const { isLoggedIn, isNotLoggedIn } = require('../middlewares');
const {
  renderProfile, renderJoin, renderMain, renderHashtag,
} = require('../controllers/page');

const router = express.Router();

// res.locals: 하나의 요청 안에서 미들웨어 간에 데이터를 전달하고 싶을 때 사용하는 객체
// 요청이 끝날 때까지만 데이터가 유지됨
router.use((req, res, next) => {
  res.locals.user = req.user;
  res.locals.followerCount = req.user?.Followers?.length || 0;
  res.locals.followingCount = req.user?.Followings?.length || 0;
  res.locals.followingIdList = req.user?.Followings?.map(f => f.id) || [];
  next();
});

// 라우터 배치 순서의 근거?

// GET /profile
// '/profile' get 요청 시, 로그인 한 경우만 renderProfile 실행
router.get('/profile', isLoggedIn, renderProfile);
// GET /join
// '/join' get 요청 시, 로그인 하지 않은 경우만 renderJoin 실행
router.get('/join', isNotLoggedIn, renderJoin);
// GET /
// '/' get 요청 시, 메인 화면 랜더링
router.get('/', renderMain);
//
router.get('/hashtag', renderHashtag);

module.exports = router;