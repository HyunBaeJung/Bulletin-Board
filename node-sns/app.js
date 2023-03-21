const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
const nunjucks = require('nunjucks'); // 넌적스는 공부할 때만 사용
const dotenv = require('dotenv');
const passport = require('passport');

// load environment variables from the '.env' file located in the root directory of the current project
dotenv.config();
const pageRouter = require('./routes/page');
const authRouter = require('./routes/auth');
const postRouter = require('./routes/post');
const userRouter = require('./routes/user');
const { sequelize } = require('./models');
const passportConfig = require('./passport');

// create an express object
const app = express();
passportConfig();
// set port for the app object
app.set('port', process.env.PORT || 8001);

// nunjucks
app.set('view engine', 'html');
nunjucks.configure('views', {
  express: app,
  watch: true,
});

// 시퀄라이즈: sync 메서드로 서버 실행 시 MySQL과 연동
sequelize.sync({ force: false })
  .then(() => {
    console.log('데이터베이스 연결 성공');
  })
  .catch((err) => {
    console.log(err);
  });

// 미들웨어 셋팅
app.use(morgan('dev'));
// static 미들웨어는 res.sendFile 메서드로 정적 파일을 제공하므로 그 다음 미들웨어들은 실행되지 않음
// 동적으로 처리해야 하는 요청이나 정적 파일을 요청하는 클라이언트가 브라우저가 아닌 경우, 다음 미들웨어들이 실행됨
app.use(express.static(path.join(__dirname, 'public')));
app.use('/img', express.static(path.join(__dirname, 'uploads')));
//
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET,
  cookie: {
    httpOnly: true,
    secure: false,
  },
}));

// passport 모듈을 app에 연결
app.use(passport.initialize());
app.use(passport.session());

// 라우터 연결
app.use('/', pageRouter);
app.use('/auth', authRouter);
app.use('/post', postRouter);
app.use('/user', userRouter);

// 에러 받는 용도?
app.use((req, res, next) => {
  const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
  error.status = 404;
  next(error);
});

// middleware for error handling
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

app.listen(app.get('port'), () => {
  console.log(app.get('port'), '번 포트에서 대기 중');
});