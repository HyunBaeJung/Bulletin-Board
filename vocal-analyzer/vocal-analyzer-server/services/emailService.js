const nodemailer = require('nodemailer');

// 이메일 관련 환경변수 로드
const email = process.env.EMAIL_AUTH_EMAIL;
const password = process.env.EMAIL_AUTH_PASSWORD;

// nodemailer transporter 설정
const transporter = nodemailer.createTransport({
  service: 'Naver',
  host: 'smtp.naver.com',
  port: 587,
  secure: false,
  auth: {
    user: email,
    pass: password,
  },
});

module.exports = transporter;
