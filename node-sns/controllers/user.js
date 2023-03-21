const User = require('../models/user');

exports.follow = async (req, res, next) => {
  try {
    // req.user.id가 followerId = 팔로우 요청하는 사람
    // req.params.id가 followingId = 팔로우 받는 사람
    const user = await User.findOne({ where: { id: req.user.id } });
    // 이미 로그인된 것이 확인된 상태인데, DB에서 user 존재 여부를 굳이 왜 확인하는가?
    // 삭제된 계정일 경우를 염두에 둔 코드인가?
    if (user) {
      await user.addFollowing(parseInt(req.params.id, 10));
      res.send('success');
    } else {
      res.status(404).send('no user');
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
};