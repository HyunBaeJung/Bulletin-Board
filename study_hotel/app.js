const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
const dotenv = require('dotenv');
const passport = require('passport');
const cors = require('cors');

dotenv.config();
const authRouter = require('./routes/auth');
const { sequelize } = require('./models');
const passportConfig = require('./passport');

const app = express();
passportConfig();
app.set('port', process.env.PORT || 8000);
sequelize.sync({ force: false })
	.then(() => {
		console.log('데이터베이스 연결 성공');
	})
	.catch((err) => {
		console.log(err);
	});

app.use(cors());
app.use(cors({
	origin: 'http://localhost:3000'
}));

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
	resave: false,  // 수정 사항 없어도 다시 저장할지 여부
	saveUninitialized: true,  // 세션에 저장할 내역이 없더라도 세션 생성할지 여부
	secret: process.env.COOKIE_SECRET,  // 쿠키 서명 비밀 키
	cookie: {
		httpOnly: false,  // 클라이언트에서 쿠키 확인 불가 => JS(리액트)에서 접근 불가
		secure: false,  // https가 아닌 환경에서도 사용 가능
	},
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', authRouter);

app.use((req, res, next) => {
	const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
	error.status = 404;
	next(error);
});

app.use((err, req, res, next) => {
	const message = err.message;
	const stack = process.env.NODE_ENV !== 'production' ? err.stack : {};
	res.status(err.status || 500);
	res.json({ message, stack });
});

app.listen(app.get('port'), () => {
	console.log(app.get('port'), '번 포트에서 대기 중');
});