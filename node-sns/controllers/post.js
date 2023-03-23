/*

const { Post, Hashtag } = require('../models');

exports.afterUploadImage = (req, res) => {
  console.log(req.file);
  res.json({ url: `img/${req.file.filename}` });
};

exports.uploadPost = async (req, res, next) => {
  try {
    const post = await Post.create({
      content: req.body.content,
      img: req.body.url,
      UserId: req.user.id,
    });

    */

    // const hashtags = req.body.content.match(/#[^\s#]*/g);
    
    /*
    
    if (hashtags) {
      const result = await Promise.all(
        hashtags.map(tag => {
          return Hashtag.findOrCreate({
            where: { title: tag.slice(1).toLowerCase() },
          })
        }),
      );
      await post.addHashtags(result.map(r => r[0]));
    }
    res.redirect('/');
  } catch (error) {
    console.error(error);
    next(error);
  }
};

exports.deletePost = async (req, res, next) => {
  try {
    console.log('요청 받았고, 응답 보내기 전');
    // 해시태그 관계 삭제 => 자동 삭제
    // OK

    // PostHashtag 테이블에 해당 해시태그가 존재하지 않으면,
    // Hashtag 테이블에서 해당 해시태그 삭제

    // 게시물 삭제
    await Post.destroy({ where: { id: req.params.id, userId: req.user.id }});

    // 해당 게시물의 이미지 파일이 다른 게시물에 없으면 uploads 폴더에서 이미지 파일 삭제

    res.send('OK');
  } catch (error) {
    console.error(error);
    next(error);
  }
}

// 게시글 수정 기능 추가
// exports.patchPost = ~~~

*/