const express = require('express');

const { isLoggedIn, isNotLoggedIn } = require('../middlewares');
const { join, login, logout, reissueAccessToken } = require('../controllers/auth');

const router = express.Router();

// POST /auth/join
router.post('/join', isNotLoggedIn, join);

// POST /auth/login
router.post('/login', isNotLoggedIn, login);

// POST /auth/logout
router.post('/logout', logout);

// POST /auth/refresh-token
router.post('/refresh-token', reissueAccessToken);

module.exports = router;
