const express = require('express');

// const { isLoggedIn } = require('../middlewares');
// const { userRouter, follow } = require('../controllers/user');
const { getUser, postUser } = require('../controllers/user');

const router = express.Router();



/////////////// test ////////////////

// GET /auth/login
router.get('/', getUser);

// POST /auth/login
router.post('/', postUser);

/////////////// test ////////////////


/*

// POST /user/:id/follow
router.post('/:id/follow', isLoggedIn, follow);

*/

module.exports = router;