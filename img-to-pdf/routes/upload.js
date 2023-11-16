const express = require('express');
const path = require('path');
const multer = require('multer');

const router = express.Router();

const storage = multer.diskStorage({
  // public/images 폴더에 이미지를 저장
  destination: function(req, file, cb) {
    cb(null, 'public/images');
  },
  // 이미지 이름 변경
  filename: function(req, file, cb) {
    cb(
      null,
      file.originalname + '-' + Date.now() + String(Math.random()).split('.')[1] + '.' + file.mimetype.split('/')[1]
    );
  }
});

const fileFilter = (req, file, callback) => {
  const ext = path.extname(file.originalname);
  // 파일 확장자가 '.png' 또는 '.jpg'가 아닌 경우 오류 페이지를 반환
  if (ext !== '.png' && ext !== '.jpg') {
    return callback(new Error('Only PNG and JPG files are accepted'));
  } else {
    return callback(null, true);
  }
}

// multer 초기화
const upload = multer({ storage, fileFilter: fileFilter });

// POST '/upload'
router.post('/', upload.array('images'), (req, res) => {
  const files = req.files;
  const imgNames = [];

  // 파일명 추출
  for (const file of files) {
    const index = Object.keys(file).findIndex((e) => e === 'filename');
    imgNames.push(Object.values(file)[index]);
  }

  // 세션에 이미지 파일 이름 저장
  req.session.imagefiles = imgNames;

  // 루트 URL 경로로 리디렉션
  res.redirect('/');
});

module.exports = router;
