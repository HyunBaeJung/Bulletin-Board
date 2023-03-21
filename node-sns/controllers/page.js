// 응답의 render 메서드는 템플릿 엔진(넌적스)과 함께 사용하는데, 리액트 사용 시엔 어떻게 처리?
// module.exports나 exports나 기능적으로 큰 차이는 없지만, exports는 속성을 부여하는 방식으로 사용해야 함

const { User, Post, Hashtag } = require('../models');

exports.renderProfile = (req, res) => {
  res.render('profile', { title: '내 정보 - Node-SNS'});
};

exports.renderJoin = (req, res) => {
  res.render('join', { title: '회원가입 - Node-SNS'});
};

exports.renderMain = async (req, res, next) => {
  try {
    const posts = await Post.findAll({
      include: {
        model: User,
        attribute: ['id', 'nick'],
      },
      order: [['createdAt', 'DESC']],
    });
    res.render('main', {
      title: 'NodeSNS',
      twits: posts,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.renderHashtag = async (req, res, next) => {
  // 어느 부분에서 쿼리스트링이 입력된 건지?
  const query = req.query.hashtag;
  if (!query) {
    return res.redirect('/');
  }
  try {
    const hashtag = await Hashtag.findOne({ where: { title: query } });
    let posts = [];
    if (hashtag) {
      // 해쉬태그와 연관된 게시물을 보여주는데, 사용자 정보도 함께 보여줌
      posts = await hashtag.getPosts({ include: [{ model: User }] });
    }

    return res.render('main', {
      title: `${query} | NodeSNS`,
      twits: posts,
    });
  } catch (error) {
    console.error(error);
    return next(error); // 마지막 부분이라 return으로 종료?
  }
}