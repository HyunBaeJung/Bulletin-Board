const express = require('express');
const path = require('path');
const fs = require('fs');
const PDFDocument = require('pdfkit');

const router = express.Router();

// POST '/pdf'
router.post('/', (req, res, next) => {
  const body = req.body;

  // 새 pdf 생성
  const doc = new PDFDocument({ size: 'A4', autoFirstPage: false });
  const pdfName = 'pdf-' + Date.now() + String(Math.random()).split('.')[1] + '.pdf';

  // pdf를 public/pdf 폴더에 저장
  doc.pipe(fs.createWriteStream(path.join(__dirname, '..', `/public/pdf/${pdfName}`)));

  // pdf 페이지를 만들고 이미지를 추가
  for (const name of body) {
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

module.exports = router;
