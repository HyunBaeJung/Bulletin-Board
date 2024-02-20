const express = require('express');

const { isLoggedIn, isNotLoggedIn } = require('../middlewares');
const { join, login, logout, reissueAccessToken } = require('../controllers/auth');

const router = express.Router();

// POST /auth/join
/**
 * @swagger
 * /auth/join:
 *   post:
 *     tags: [Auth]
 *     summary: 회원가입
 *     description: 사용자가 제출한 사용자 정보로 회원가입 진행
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               accountName:
 *                 type: string
 *                 description: 사용자 아이디
 *                 example: "user123"
 *               password:
 *                 type: string
 *                 description: 비밀번호
 *                 format: password
 *                 example: "123456"
 *               realName:
 *                 type: string
 *                 description: 실명
 *                 example: "홍길동"
 *               birthday:
 *                 type: string
 *                 format: date
 *                 description: 생년월일(YYYY-MM-DD)
 *                 example: 1990-01-01
 *               gender:
 *                 type: string
 *                 description: 성별
 *                 example: 남성
 *                 enum: [male, female]
 *     responses:
 *       201:
 *         description: 회원가입 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: string
 *                   example: JOIN_SUCCEEDED
 *                 message:
 *                   type: string
 *                   example: 회원가입이 완료되었습니다. 로그인 해주세요.
 *       200:
 *         description: 회원가입 실패(이미 가입된 계정)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: string
 *                   example: JOIN_FAILED
 *                 message:
 *                   type: string
 *                   example: 이미 가입된 회원입니다.
 *       500:
 *         description: 서버 에러
 */
router.post('/join', isNotLoggedIn, join);

// POST /auth/login
/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: 사용자 로그인
 *     description: 사용자 아이디와 비밀번호 입력하여 로그인을 진행
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               accountName:
 *                 type: string
 *                 description: 사용자 아이디
 *                 example: "user123"
 *               password:
 *                 type: string
 *                 description: 비밀번호
 *                 format: password
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: 로그인 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: string
 *                   example: LOGIN_SUCCEEDED
 *                 loginId:
 *                   type: string
 *                   example: user123
 *                   description: 사용자 아이디(로그인 식별 용도)
 *                 accessToken:
 *                   type: string
 *                   description: 액세스 토큰
 *                 refreshToken:
 *                   type: string
 *                   description: 리프레시 토큰
 *       401:
 *         description: 로그인 실패(인증 실패)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: string
 *                   example: LOGIN_FAILED
 *                 message:
 *                   type: string
 *                   example: 비밀번호가 일치하지 않습니다., 가입되지 않은 계정입니다.
 *       500:
 *         description: 서버 에러
 */
router.post('/login', isNotLoggedIn, login);

// POST /auth/logout
/**
 * @swagger
 * /auth/logout:
 *   post:
 *     tags: [Auth]
 *     summary: 로그아웃
 *     description: 사용자 로그아웃 진행
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               accountName:
 *                 type: string
 *                 description: 로그아웃할 사용자 아이디
 *                 example: "user123"
 *     parameters:
 *       - in: header
 *         name: X-Refresh-Token
 *         required: true
 *         schema:
 *           type: string
 *         description: 사용자의 리프레시 토큰
 *     responses:
 *       200:
 *         description: 로그아웃 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: string
 *                   example: LOGOUT_SUCCEEDED
 *       500:
 *         description: 서버 에러
 */
router.post('/logout', logout);

// POST /auth/refresh-token
/**
 * @swagger
 * /auth/reissue-access-token:
 *   post:
 *     tags: [Auth]
 *     summary: 액세스 토큰 재발급
 *     description: 리프레시 토큰을 사용하여 새로운 액세스 토큰 재발급
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               accountName:
 *                 type: string
 *                 description: 사용자 아이디
 *                 example: "user123"
 *     parameters:
 *       - in: header
 *         name: X-Refresh-Token
 *         required: true
 *         schema:
 *           type: string
 *         description: 사용자의 리프레시 토큰
 *     responses:
 *       200:
 *         description: 토큰 재발급 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: string
 *                   example: TOKEN_REISSUE_SUCCEEDED
 *                 accessToken:
 *                   type: string
 *                   description: 새로운 액세스 토큰
 *                 refreshToken:
 *                   type: string
 *                   description: 새로운 리프레시 토큰
 *       403:
 *         description: 리프레시 토큰 만료 또는 유효하지 않음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: string
 *                   example: REFRESH_TOKEN_EXPIRED
 *       500:
 *         description: 서버 에러
 */
router.post('/refresh-token', reissueAccessToken);

module.exports = router;
