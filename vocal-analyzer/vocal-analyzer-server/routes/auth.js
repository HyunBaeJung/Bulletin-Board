const express = require('express');

const { join, withdrawal } = require('../controllers/auth');
const { login, logout, reissueAccessToken } = require('../controllers/auth');
const { sendEmailAuthCode, verifyEmailAuthCode, getAccountName } = require('../controllers/auth');
const { loadProfile, changePassword, changeEmail } = require('../controllers/auth');
const { isLoggedIn, isNotLoggedIn } = require('../middlewares');

const router = express.Router();

// POST /auth/join
router.post('/join', isNotLoggedIn, join);

// DELETE /auth/withdrawal
router.delete('/withdrawal', isLoggedIn, withdrawal);

// POST /auth/login
router.post('/login', isNotLoggedIn, login);

// POST /auth/logout
router.post('/logout', logout);

// POST /auth/refresh-token
router.post('/refresh-token', reissueAccessToken);

// POST /auth/email-auth/code
router.post('/email-auth/code', sendEmailAuthCode);

// POST /auth/email-auth/verification
router.post('/email-auth/verfication', verifyEmailAuthCode);

// GET /auth/recovery/account-name
router.get('/recovery/account-name', getAccountName);

// PUT /auth/recovery/password
router.put('/recovery/password', changePassword);

// GET /auth/profile
router.get('/profile', isLoggedIn, loadProfile);

// PATCH /auth/profile/password
router.patch('/profile/password', isLoggedIn, changePassword);

// PUT /auth/profile/email
router.put('/profile/email', isLoggedIn, changeEmail);

module.exports = router;
