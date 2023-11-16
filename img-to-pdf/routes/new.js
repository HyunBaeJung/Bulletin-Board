const express = require('express');
const path = require('path');
const { unlink } = require('fs/promises');

const router = express.Router();

// GET '/new'
router.get('/', (req, res, next) => {
  // 세션에 저장된 파일 삭제
  const filenames = req.session.imagefiles;
  const deleteFiles = async (paths) => {
    const deleting = paths.map((file) => unlink(path.join(__dirname, '..', `/public/images/${file}`)));
    await Promise.all(deleting);
  }
  deleteFiles(filenames);

  // 세션에서 데이터 제거
  req.session.imagefiles = undefined;

  // 루트 URL로 리디렉션
  res.redirect('/');
});

module.exports = router;
