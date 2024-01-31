const jwt = require('jsonwebtoken');

const authHeader = req.headers?.authorization;
const accessToken = authHeader?.split(' ')[1];

// 로그인 상태 확인
exports.isLoggedIn = (res, req, next) => {
  if (!accessToken) {
    return res.status(401).send({
      code: 'IS NOT LOGGED IN',
      message: '로그인이 필요합니다.',
    });
  }

  try {
    jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET, {
      algorithms: ['HS256']
    });
    next();
  } catch (error) {
    return res.status(401).send({
      code: 'IS NOT LOGGED IN',
      message: '로그인이 필요합니다.',
    });
  }
};

// 로그아웃 상태 확인
exports.isNotLoggedIn = (res, req, next) => {
  if (accessToken) {
    try {
      jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET, {
        algorithms: ['HS256']
      });
      return res.status(401).send({
        code: 'IS LOGGED IN',
        message: '이미 로그인 한 상태입니다.',
      });
    } catch (error) {
      next();
    }
  } else {
    next();
  }
};
