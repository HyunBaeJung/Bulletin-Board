const express = require('express');
const path = require('path');
const morgan = require('morgan');
const session = require('express-session');
const dotenv = require('dotenv');

dotenv.config();
const pageRouter = require('./routes/page');
const uploadRouter = require('./routes/upload');
const pdfRouter = require('./routes/pdf');
const newRouter = require('./routes/new');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: process.env.SESSION_SECRET,
  cookie: {
    httpOnly: true,
    secure: false,
  },
}));

// 라우터 설정
app.use('/', pageRouter);
app.use('/upload', uploadRouter);
app.use('/pdf', pdfRouter);
app.use('/new', newRouter);

// 404 에러 처리
app.use((req, res, next) => {
  const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
  error.status = 404;
  next(error);
});

// 에러 처리 미들웨어
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
