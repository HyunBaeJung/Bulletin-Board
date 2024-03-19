const Sequelize = require('sequelize');
const passport = require('passport');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

const User = require('../models/user');
const EmailAuth = require('../models/email_auth');
const connectToRedis = require('../services/redisClient');
const transporter = require('../services/emailService');

/**
 * Auth 1. 회원가입
 */
exports.join = async (req, res, next) => {
  const { accountName, password, realName, birthday, gender, email } = req.body;
  try {
    // 이미 가입된 사용자 여부 확인
    const exUser = await User.findOne({ where: { accountName } });
    if (exUser) {
      return res.status(200).send({
        code: 'JOIN_FAILED',
        message: '이미 가입된 회원입니다.',
      });
    }

    // 회원가입 정보 DB에 저장
    const hash = await bcrypt.hash(password, 12);
    await User.create({
      accountName,
      password: hash,
      realName,
      birthday,
      gender,
      email,
    });
    return res.status(201).send({
      code: 'JOIN_SUCCEEDED',
      message: '회원가입이 완료되었습니다. 로그인 해주세요.',
    });
  } catch (error) {
    console.error(error);
    return next(error);
  }
};

/**
 * Auth 2. 회원탈퇴
 */
exports.withdrawal = async (req, res, next) => {
  const { accountName } = req.query;
  try {
    // 사용자 정보 삭제
    await User.destroy({ where: { accountName } });

    // Redis에서 리프레시 토큰 및 로그인세션키 삭제
    const client = await connectToRedis();
    await client.select(1);
    await client.del(`refreshToken:${accountName}`);
    await client.del(`loginSessionKey:${accountName}`);
    await client.quit();

    return res.status(200).send({
      code: 'WITHDRAWAL SUCCEEDED',
    });

  } catch (error) {
    console.error(error);
    return next(error);
  }
};

/**
 * Auth 3. 로그인
 */
exports.login = (req, res, next) => {
  passport.authenticate('local', (authError, user, info) => {
    console.log(authError, user, info);
    if (authError) {
      console.error(authError);
      return next(authError);
    }
    if (!user) {
      return res.status(200).send({
        code: 'LOGIN_FAILED',
        message: info.message,
      });
    }

    return req.login(user, { session: false }, async (loginError) => {
      if (loginError) {
        console.error(loginError);
        return next(loginError);
      }

      // 중복로그인 방지를 위한 로그인세션키 생성
      const loginSessionKey = uuidv4();

      // 액세스 토큰 및 리프레시 토큰 생성
      const accessToken = jwt.sign({
        id: user.accountName,
        username: user.realName,
        loginSessionKey,
      }, process.env.JWT_ACCESS_SECRET, {
        expiresIn: '15m',
        issuer: 'vocal-analyzer',
        algorithm: 'HS256',
      });
      const refreshToken = jwt.sign({
        id: user.accountName,
      }, process.env.JWT_REFRESH_SECRET, {
        expiresIn: '5d',
        issuer: 'vocal-analyzer',
        algorithm: 'HS256',
      });

      // Redis에 액세스 토큰 로그인세션키와 리프레시 토큰 데이터 저장
      try {
        const client = await connectToRedis();
        await client.select(1);
        // 로그인세션키 저장
        await client.set(`loginSessionKey:${user.accountName}`, loginSessionKey, 'EX', 5 * 24 * 3600);
        // 리프레시 토큰 저장
        await client.set(`refreshToken:${user.accountName}`, refreshToken, 'EX', 5 * 24 * 3600);
        await client.quit();
      } catch (redisError) {
        console.error(redisError);
        return next(redisError);
      }

      return res.status(200).send({
        code: 'LOGIN_SUCCEEDED',
        loginId: user.accountName,
        accessToken,
        refreshToken,
      });
    });
  })(req, res, next);
};

/**
 * Auth 4. 로그아웃
 */
exports.logout = async (req, res, next) => {
  const accountName = req.body.accountName;
  const refreshToken = req.headers['x-refresh-token'];

  try {
    const client = await connectToRedis();

    // Redis에서 로그인세션키 삭제
    const redisLoginSessionKey = await client.get(`loginSessionKey:${accountName}`);
    if (redisLoginSessionKey) await client.del(`loginSessionKey:${accountName}`);

    // 리프레시 토큰이 있는 경우
    if (refreshToken) {
      jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, { algorithms: ['HS256'] });

      const redisRefreshToken = await client.get(`refreshToken:${accountName}`);

      // 리프레시 토큰이 유효한 경우 Redis에서 리프레시 토큰 데이터 삭제
      if (redisRefreshToken && redisRefreshToken === refreshToken) {
        await client.del(`refreshToken:${accountName}`);
      }
    }

    await client.quit();

  } catch (error) {
    console.error(error);
    // 토큰 검증 실패를 제외한 에러
    if (!(error instanceof jwt.JsonWebTokenError)) {
      return next(error);
    }
  }

  return res.status(200).send({
    code: 'LOGOUT_SUCCEEDED',
  });
};

/**
 * Auth 5. 액세스 토큰 재발급
 */
exports.reissueAccessToken = async (req, res, next) => {
  const accountName = req.body.accountName;
  const refreshToken = req.headers['x-refresh-token'];

  if (refreshToken) {
    try {
      // 리프레시 토큰 검증
      jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, { algorithms: ['HS256'] });

      // Redis에서 리프레시 토큰 데이터 조회
      const client = await connectToRedis();
      await client.select(1);

      const redisRefreshToken = await client.get(`refreshToken:${accountName}`);

      if (redisRefreshToken && redisRefreshToken === refreshToken) {
        const userInfo = await User.findOne({ where: { accountName } });
        const newLoginSessionKey = uuidv4();

        // 새 액세스 토큰 재발급
        const newAccessToken = jwt.sign({
          id: accountName,
          username: userInfo.realName,
          loginSessionKey: newLoginSessionKey,
        }, process.env.JWT_ACCESS_SECRET, {
          expiresIn: '15m',
          issuer: 'happylibrary',
          algorithm: 'HS256',
        });
        // 새 리프레시 토큰 재발급
        const newRefreshToken = jwt.sign({
          id: accountName,
        }, process.env.JWT_REFRESH_SECRET, {
          expiresIn: '5d',
          issuer: 'happylibrary',
          algorithm: 'HS256',
        });

        // Redis에 리프레시 토큰과 로그인세션키 데이터 갱신
        await client.set(`refreshToken:${accountName}`, newRefreshToken, 'EX', 5 * 24 * 3600);
        await client.set(`loginSessionKey:${accountName}`, newLoginSessionKey, 'EX', 5 * 24 * 3600);

        await client.quit();

        return res.status(200).send({
          code: 'TOKEN_REISSUE_SUCCEEDED',
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
        });
      }
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return res.status(403).send({
          code: 'REFRESH_TOKEN_EXPIRED',
        });
      } else if (error instanceof jwt.JsonWebTokenError) {
        return res.status(403).send({
          code: 'INVALID_REFRESH_TOKEN',
        });
      } else {
        console.error(error);
        return next(error);
      }
    }
  } else {
    return res.status(403).send({
      code: 'NO_REFRESH_TOKEN',
    });
  }
};

/**
 * Auth 6. 이메일 인증 보안코드 전송
 */
exports.sendEmailAuthCode = async (req, res, next) => {
  const { accountName, email } = req.body;
  const emailAuthCode = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');

  const mailOptions = {
    from: process.env.EMAIL_AUTH_EMAIL,
    to: email,
    subject: '[보컬분석기] 이메일 본인인증 메일입니다.',
    html: `
      <p>본인인증 메일입니다.</p>
      <p>아래 인증번호 6자리를 입력해주세요.</p>
      <p>인증번호: <b>${emailAuthCode}</b></p>
    `,
  };

  try {
    // 이메일 인증 메일 전송
    const result = await transporter.sendMail(mailOptions);
    console.log('이메일 전송 성공', result);

    // 이메일 인증 데이터 저장
    // 계정명(account_name) 없이 저장하는 경우: 회원가입, 아이디 찾기
    // 계정명(account_name)을 함께 저장하는 경우: 비밀번호 찾기, 회원정보 변경, 회원탈퇴
    await EmailAuth.create({
      accountName,
      email,
      emailAuthCode,
      expiredAt: Sequelize.literal('DATE_ADD(NOW(), INTERVAL 3 MINUTE)'),
      verified: false,
    });

    return res.status(201).send({
      code: 'AUTH_CODE_SENT',
    });

  } catch (error) {
    console.error(error);
    return next(error);
  }
};

/**
 * Auth 7. 이메일 인증 보안코드 검증
 */
exports.verifyEmailAuthCode = async () => {
  const { email, emailAuthCode } = req.body;
  const { Op } = Sequelize;

  try {
    const emailAuthData = await EmailAuth.findOne({
      where: {
        email,
        expiredAt: {
          [Op.gt]: Sequelize.literal('NOW()'),
        },
        verified: false,
      },
      order: [['createdAt', 'DESC']],
    });

    // 유효한 모바일 인증 데이터가 존재하지 않는 경우(기한 만료)
    if (!emailAuthData) {
      return res.status(200).send({
        code: 'AUTH_CODE_VERIFICATION_FAILED',
        message: '인증번호의 유효시간이 만료되었습니다. 다시 시도해 주세요.'
      });
    }
    // 보안코드가 일치하지 않는 경우
    if (emailAuthCode !== emailAuthData.emailAuthCode) {
      return res.status(200).send({
        code: 'AUTH_CODE_VERIFICATION_FAILED',
        message: '인증번호가 일치하지 않습니다.',
      });
    }

    return res.status(200).send({
      code: 'AUTH_CODE_VERIFICATION_SUCCEEDED',
    });

  } catch (error) {
    console.error(error);
    return next(error);
  }
};

/**
 * Auth 8. 아이디 찾기
 */
exports.getAccountName = async (req, res, next) => {
  const { email } = req.query;

  try {
    const exUser = await User.findOne({ where: { email } });

    // 해당 이메일 주소로 가입된 계정이 없는 경우
    if (!exUser) {
      return res.status(200).send({
        code: 'FIND_ID_FAILED',
        message: '해당 이메일 주소로 가입된 계정이 없습니다.',
      });
    }

    return res.status(200).send({
      code: 'FIND_ID_SUCCEEDED',
      accountName: exUser.accountName,
    });

  } catch (error) {
    console.error(error);
    return next(error);
  }
};

/**
 * Auth 9. 회원정보 불러오기
 */
exports.loadProfile = async (req, res, next) => {
  console.log("loadProfile", req.query);
  const { accountName } = req.query;
  try {
    //const userInfo = await User.findOne({ where: { accountName } });
    const userInfo = await User.findOne({ where: { accountName } });
    console.log("what!!!!!!!", userInfo);
    return res.status(200).send({
      code: 'LOAD PROFILE SUCCEEDED',
      userInfo,
    });
  } catch (error) {
    console.error(error);
    return next(error);
  }
};

/**
 * Auth 10. 비밀번호 변경(비밀번호 찾기)
 */
exports.changePassword = async (req, res, next) => {
  const { accountName, currentPassword, newPassword } = req.body;

  try {
    // 비밀번호 변경의 경우, 현재 비밀번호 일치 여부 확인
    if (currentPassword) {
      const { password } = await User.findOne({
        where: { accountName },
        attributes: ['password'],
      });

      const result = await bcrypt.compare(currentPassword, password);
      if (!result) {
        return res.status(200).send({
          code: 'CHANGE_PASSWORD_FAILED',
          message: '비밀번호가 일치하지 않습니다.',
        });
      }
    }

    // 새 비밀번호로 변경
    const hash = await bcrypt.hash(newPassword, 12);
    await User.update({ password: hash }, {
      where: { accountName },
    });

    return res.status(200).send({
      code: 'CHANGE_PASSWORD_SUCCEEDED',
      message: '비밀번호가 변경되었습니다. 다시 로그인 해주세요.',
    });

  } catch (error) {
    console.error(error);
    return next(error);
  }
};

/**
 * Auth 11. 휴대폰 번호 변경
 */
exports.changeEmail = async (req, res, next) => {
  const { accountName, newEmail } = req.body;

  try {
    await User.update({ email: newEmail }, {
      where: { accountName },
    });

    return res.status(200).send({
      code: 'EMAIL_UPDATED',
    });

  } catch (error) {
    console.error(error);
    return next(error);
  }
};
