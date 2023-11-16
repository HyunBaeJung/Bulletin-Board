const express = require('express');
const path = require('path');

const router = express.Router();

// GET '/'
router.get('/', (req, res, next) => {
  // 세션에 imagefiles가 없는 경우, 일반 HTML 페이지를 반환
  if (req.session.imagefiles === undefined) {
    res.sendFile(path.join(__dirname, '..', '/public/html/index.html'));
  // 세션에 저장된 imagefiles가 있는 경우, index.jade 파일을 렌더링
  } else {
    res.render('index', { images: req.session.imagefiles });
  }
});

module.exports = router;
