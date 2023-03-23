const express = require('express');

const { isLoggedIn } = require('../middlewares');
const { userRouter, follow, getUser, postUser } = require('../controllers/user');

const router = express.Router();



/////////////// test ////////////////

// GET /auth/login
router.get('/user', getUser);

// POST /auth/login
router.post('/user', postUser);

/////////////// test ////////////////



// POST /user/:id/follow
router.post('/:id/follow', isLoggedIn, follow);

// router.post('/user', userRouter);
// router.get('/user', userRouter);

module.exports = router;