/*

const { User, Post, Hashtag } = require('../models');

exports.renderProfile = (req, res) => {
  res.send('renderProfile');
  // res.render('profile', { title: '내 정보 - Node SNS' });
};

exports.renderJoin = (req, res) => {
  res.send('renderJoin');
  // res.render('join', { title: '회원가입 - Node SNS' });
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
    res.send('test OK');
    //res.render('main', {
    //  title: 'Node SNS',
    //  twits: posts,
    //});
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.renderHashtag = async (req, res, next) => {
  // 어느 부분에서 쿼리스트링이 입력된 건지?
  const query = req.query.hashtag;
  if (!query) {
    return res.send('redirecct');
    // return res.redirect('/');
  }
  try {
    const hashtag = await Hashtag.findOne({ where: { title: query } });
    let posts = [];
    if (hashtag) {
      posts = await hashtag.getPosts({ include: [{ model: User }] });
    }

    return res.render('main', {
      title: `${query} | Node SNS`,
      twits: posts,
    });
    
    res.send('renderHashtag');
  } catch (error) {
    console.error(error);
    return next(error); // 마지막 부분이라 return으로 종료?
  }
}

*/