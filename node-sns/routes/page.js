const express = require('express');
const { isLoggedIn, isNotLoggedIn } = require('../middlewares');
const {
  renderProfile, renderJoin, renderMain, renderHashtag,
} = require('../controllers/page');

const router = express.Router();

router.use((req, res, next) => {
  res.locals.user = req.user;
  res.locals.followerCount = req.user?.Followers?.length || 0;
  res.locals.followingCount = req.user?.Followings?.length || 0;
  res.locals.followingIdList = req.user?.Followings?.map(f => f.id) || [];
  next();
});

// GET /profile
router.get('/profile', isLoggedIn, renderProfile);
// GET /join
router.get('/join', isNotLoggedIn, renderJoin);
// GET /
router.get('/', renderMain);
// GET /hashtag
router.get('/hashtag', renderHashtag);

module.exports = router;