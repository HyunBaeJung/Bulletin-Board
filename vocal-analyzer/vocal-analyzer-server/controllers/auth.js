const passport = require('passport');
const brcypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const connectToRedis = require('../services/redisClient');

// 회원가입
exports.join = async (req, res, next) => {
  const { userId, password, realName, birthday, gender, email } = req.body;
  try {
    // 이미 가입된 사용자 여부 확인
    const exUser = await User.findOne({ where: { userId } });
    if (exUser) {
      return res.status(200).send({
        code: 'JOIN FAIL',
        message: '이미 가입된 회원입니다.',
      });
    }

    // 회원가입 정보 DB에 저장
    const hash = await brcypt.hash(password, 12);
    await User.create({
      userId,
      password: hash,
      realName,
      birthday,
      gender,
      email,
    });
    return res.status(201).send({
      code: 'JOIN SUCCESS',
      message: '회원가입 성공! 로그인 해주세요.',
    });
  } catch (error) {
    console.error(error);
    return next(error);
  }
};

// 로그인
exports.login = (req, res, next) => {
  passport.authenticate('local', (authError, user, info) => {
    console.log(authError, user, info);
    if (authError) {
      console.error(authError);
      return next(authError);
    }
    if (!user) {
      return res.status(401).send({
        code: 'LOGIN FAIL',
        message: info.message,
      });
    }

    return req.login(user, { session: false }, async (loginError) => {
      if (loginError) {
        console.error(loginError);
        return next(loginError);
      }

      // 액세스 토큰 및 리프레시 토큰 생성
      const accessToken = jwt.sign({
        id: user.userId,
        username: user.realName,
      }, process.env.JWT_ACCESS_SECRET, {
        expiresIn: '15m',
        issuer: 'vocal-analyzer',
        algorithm: 'HS256',
      });
      const refreshToken = jwt.sign({
        id: user.userId,
      }, process.env.JWT_REFRESH_SECRET, {
        expiresIn: '5d',
        issuer: 'vocal-analyzer',
        algorithm: 'HS256',
      });

      // Redis에 리프레시 토큰 데이터 저장
      try {
        const client = await connectToRedis();
        await client.set(user.userId, refreshToken, 'EX', 5 * 24 * 3600);
      } catch (error) {
        console.error(redisError);
        return next(redisError);
      }

      return res.status(200).send({
        code: 'LOGIN SUCCESS',
        accessToken,
        refreshToken,
      });
    });
  })(req, res, next);
};

// 로그아웃
exports.logout = async (req, res, next) => {
  const authHeader = req.headers?.authorization;
  const refreshToken = authHeader?.split(' ')[1];

  if (refreshToken) {
    try {
      // 리프레시 토큰이 유효한 경우 Redis에서 리프레시 토큰 데이터 삭제
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, {
        algorithms: ['HS256']
      });
      const userId = decoded.id;

      const client = await connectToRedis();
      const redisRefreshToken = await client.get(userId);
    
      if (redisRefreshToken && redisRefreshToken === refreshToken) {
        await client.del(userId);
      }
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        // 토큰 만료
        console.error(error);
        return res.status(200).send({
          code: 'LOGOUT SUCCESS',
        });
      } else {
        console.error(error);
        next(error);
      }
    }
  } else {
    return res.status(200).send({
      code: 'LOGOUT SUCCESS',
    });
  }
};

exports.renewAccessToken = async (res, req, next) => {  
  const authHeader = req.headers?.authorization;
  const refreshToken = authHeader?.split(' ')[1];

  if (refreshToken) {
    try {
      // 리프레시 토큰 검증
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, {
        algorithms: ['HS256']
      });
      const userId = decoded.id;

      // Redis에서 리프레시 토큰 데이터 조회
      const client = await connectToRedis();
      const redisRefreshToken = await client.get(userId);
      if (redisRefreshToken && redisRefreshToken === refreshToken) {
        const userInfo = await User.findOne({ where: { userId } });
        // 새 액세스 토큰 재발급
        const newAccessToken = jwt.sign({
          id: userId,
          username: userInfo.realName,
        }, process.env.JWT_ACCESS_SECRET, {
          expiresIn: '15m',
          issuer: 'happylibrary',
          algorithm: 'HS256',
        });
        // 새 리프레시 토큰 재발급
        const newRefreshToken = jwt.sign({
          id: userId,
        }, process.env.JWT_REFRESH_SECRET, {
          expiresIn: '5d',
          issuer: 'happylibrary',
          algorithm: 'HS256',
        });

        // Redis에 리프레시 토큰 정보 갱신
        await client.set(userId, newRefreshToken);

        return res.status(200).send({
          code: 'TOKEN REISSUE SUCCESS',
          newAccessToken,
          newRefreshToken,
        });
      }
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        return res.status(401).send({
          code: 'TOKEN REISSUE FAIL',
          message: '리프레시 토큰이 유효하지 않습니다.',
        });
      } else if (error instanceof jwt.TokenExpiredError) {
        return res.status(401).send({
          code: 'TOKEN REISSUE FAIL',
          message: '리프레시 토큰이 만료되었습니다.',
        });
      } else {
        console.error(error);
        next(error);
      }
    }
  } else {
    return res.status(401).send({
      code: 'TOKEN REISSUE FAIL',
      message: '리프레시 토큰이 없습니다.',
    });
  }
};
