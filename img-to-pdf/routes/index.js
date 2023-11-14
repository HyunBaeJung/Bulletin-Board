const express = require('express');
const router = express.Router();

const multer = require('multer');
const path = require('path');
const fs = require('fs');

const PDFDocument = require('pdfkit');
const { unlink } = require('fs/promises');

let storage = multer.diskStorage({
  // public/images 폴더에 이미지를 저장
  destination: function(req, file, cb) {
    cb(null, 'public/images');
  },
  // 이미지 이름 변경
  filename: function(req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + '.' + file.mimetype.split('/')[1]);
  }
});

let fileFilter = (req, file, callback) => {
  let ext = path.extname(file.originalname);
  // 파일 확장자가 '.png' 또는 '.jpg'가 아닌 경우 오류 페이지를 반환
  if (ext !== '.png' && ext !== '.jpg') {
    return callback(new Error('Only PNG and JPG files are accepted'));
  } else {
    return callback(null, true);
  }
}

// multer 초기화
const upload = multer({ storage, fileFilter: fileFilter });

router.post('/upload', upload.array('images'), (req, res) => {
  let files = req.files;
  let imgNames = [];

  // 파일명 추출
  for (const file of files) {
    let index = Object.keys(file).findIndex((e) => e === 'filename');
    imgNames.push(Object.values(file)[index]);
  }

  // 세션에 이미지 파일 이름 저장
  req.session.imagefiles = imgNames;

  // 루트 URL 경로로 리디렉션
  res.redirect('/');
});

router.get('/', (req, res, next) => {
  // 세션에 imagefiles가 없는 경우, 일반 HTML 페이지를 반환
  if (req.session.imagefiles === undefined) {
    res.sendFile(path.join(__dirname, '..', '/public/html/index.html'));
  // 세션에 저장된 imagefiles가 있는 경우, index.jade 파일을 렌더링
  } else {
    res.render('index', { images: req.session.imagefiles });
  }
});

router.post('/pdf', (req, res, next) => {
  let body = req.body;

  // 새 pdf 생성
  let doc = new PDFDocument({ size: 'A4', autoFirstPage: false });
  let pdfName = 'pdf-' + Date.now() + '.pdf';

  // pdf를 public/pdf 폴더에 저장
  doc.pipe(fs.createWriteStream(path.join(__dirname, '..', `/public/pdf/${pdfName}`)));

  // pdf 페이지를 만들고 이미지를 추가
  for (let name of body) {
    doc.addPage();
    doc.image(
      path.join(__dirname, '..', `/public/images/${name}`), 20, 20, { width: 555.28, align: 'center', valign: 'center' }
    );
  }

  // 프로세스 종료
  doc.end();

  // 브라우저로 주소 전송
  res.send(`/pdf/${pdfName}`);
});

router.get('/new', (req, res, next) => {
  // 세션에 저장된 파일 삭제
  let filenames = req.session.imagefiles;
  let deleteFiles = async (paths) => {
    let deleting = paths.map((file) => unlink(path.join(__dirname, '..', `/public/images/${file}`)));
    await Promise.all(deleting);
  }
  deleteFiles(filenames);

  // 세션에서 데이터 제거
  req.session.imagefiles = undefined;

  // 루트 URL로 리디렉션
  res.redirect('/');
});

module.exports = router;
