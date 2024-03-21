const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const Sequelize = require('sequelize');
const { v4: uuidv4 } = require('uuid');

const EmailAuth = require('../models/email_auth');
const User = require('../models/user');
const transporter = require('../services/emailService');
const connectToRedis = require('../services/redisClient');

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
    console.log('회원가입 실패');
    console.log('MySQL(시퀄라이즈) 또는 bcrypt 관련 에러 발생');
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
  } catch (error) {
    console.log('회원탈퇴 실패');
    console.log('MySQL(시퀄라이즈) 또는 Redis 관련 에러 발생');
    console.error(error);
    return next(error);
  }

  return res.status(200).send({
    code: 'WITHDRAWAL SUCCEEDED',
  });
};

/**
 * Auth 3. 로그인
 */
exports.login = (req, res, next) => {
  passport.authenticate('local', (authError, user, info) => {
    // 로컬 로그인 전략 수행 실패
    if (authError) {
      console.log('로그인 실패');
      console.log('로컬 로그인 전략 수행 중 에러 발생');
      console.error(error);
      return next(authError);
    }

    // 로그인 실패(실패 원인이 서버가 아닌 사용자에 의한 경우)
    if (!user) {
      return res.status(200).send({
        code: 'LOGIN_FAILED',
        message: info.message,
      });
    }

    return req.login(user, { session: false }, async (loginError) => {
      // Passport 사용자 처리 과정에서 에러가 발생한 경우
      // 세션 설정을 하지 않았으므로 세션 관련 에러의 가능성은 거의 없음
      if (loginError) {
        console.log('로그인 실패');
        console.log('passport 사용자 처리 과정에서 에러 발생');
        console.error(loginError);
        return next(loginError);
      }

      // 중복로그인 방지를 위한 로그인세션키 생성
      const loginSessionKey = uuidv4();

      // 액세스 토큰 생성
      const accessToken = jwt.sign({
        id: user.accountName,
        username: user.realName,
        loginSessionKey,
      }, process.env.JWT_ACCESS_SECRET, {
        expiresIn: '15m',
        issuer: 'vocal-analyzer',
        algorithm: 'HS256',
      });
      // 리프레시 토큰 생성
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
        await client.set(`loginSessionKey:${user.accountName}`, loginSessionKey, 'EX', 5 * 24 * 3600);
        await client.set(`refreshToken:${user.accountName}`, refreshToken, 'EX', 5 * 24 * 3600);
        await client.quit();
      } catch (redisError) {
        console.log('로그인 실패');
        console.log('Redis 관련 에러 발생');
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
  const { accountName } = req.body;

  try {
    // 사용자 식별이 가능한 경우, Redis에서 리프레시 토큰과 로그인세션키 삭제
    if (accountName) {
      const client = await connectToRedis();
      await client.select(1);

      // Redis에 로그인세션키가 남아 있다면 데이터 삭제
      const redisLoginSessionKey = await client.get(`loginSessionKey:${accountName}`);
      if (redisLoginSessionKey) await client.del(`loginSessionKey:${accountName}`);
      // Redis에 리프레시 토큰이 남아 있다면 데이터 삭제
      const redisRefreshToken = await client.get(`refreshToken:${accountName}`);
      if (redisRefreshToken) await client.del(`refreshToken:${accountName}`);

      await client.quit();
    }
  } catch (error) {
    console.log('로그아웃 실패');
    console.log('Redis 관련 에러 발생');
    console.error(error);
    return next(error);
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

  // 리프레시 토큰 쿠키가 존재하는 경우
  if (refreshToken) {
    try {
      // 리프레시 토큰 검증
      jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, { algorithms: ['HS256'] });
  
      // Redis에서 리프레시 토큰 데이터 조회
      const client = await connectToRedis();
      await client.select(1);
      const redisRefreshToken = await client.get(`refreshToken:${accountName}`);
  
      // Redis에 해당 사용자의 리프레시 토큰 데이터가 존재하고 요청 객체의 리프레시 토큰과 일치하는 경우
      if (redisRefreshToken && redisRefreshToken === refreshToken) {
        const { realName } = await User.findOne({ 
          where: { accountName },
          attributes: ['realName'], 
        });
  
        const newLoginSessionKey = uuidv4();
  
        // 새 액세스 토큰 재발급
        const newAccessToken = jwt.sign({
          id: accountName,
          username: realName,
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
      // Redis에 해당 사용자의 리프레시 토큰 데이터가 존재하지 않는 경우
      } else if (!redisRefreshToken) {
        return res.status(403).send({
          code: 'REFRESH_TOKEN_NOT_FOUND',
        });
      // Redis에 저장된 사용자의 리프레시 토큰 데이터와 요청 객체의 리프레시 토큰이 일치하지 않는 경우
      } else {
        return res.status(403).send({
          code: 'REFRESH_TOKEN_MISMATCH',
        });
      }
    } catch (error) {
      // 리프레시 토큰이 만료된 경우
      if (error instanceof jwt.TokenExpiredError) {
        return res.status(403).send({
          code: 'REFRESH_TOKEN_EXPIRED',
        });
      // 리프레시 토큰이 유효하지 않은 경우 등 만료된 경우를 제외한 토큰 검증 에러
      } else if (error instanceof jwt.JsonWebTokenError) {
        return res.status(403).send({
          code: 'INVALID_REFRESH_TOKEN',
        });
      // 그 외 에러
      } else {
        console.log('액세스 토큰 재발급 실패');
        console.log('MySQL(시퀄라이즈) 또는 Redis 관련 에러 발생');
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
 * Auth 6. 이메일 인증코드 전송
 */
exports.sendEmailAuthCode = async (req, res, next) => {
  const { accountName, email, isRegisteredEmailRequired } = req.body;
  const emailAuthCode = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');

  try {
    const whereClause = { email };

    if (accountName) whereClause.accountName = accountName;

    const exUser = await User.findOne({ where: whereClause });

    // 회원가입 및 이메일 변경의 경우, 이미 해당 이메일로 가입된 정보가 있는 경우 실패
    if (!isRegisteredEmailRequired && exUser) {
      return res.status(200).send({
        code: 'AUTH_CODE_SEND_FAILED',
        message: '이미 해당 이메일로 가입된 정보가 존재합니다.',
      });
    // 회원탈퇴 또는 아이디 및 비밀번호 찾기의 경우, 아이디와 이메일이 일치하는 기존 가입정보가 없다면 실패
    } else if (isRegisteredEmailRequired && !exUser) {
      return res.status(200).send({
        code: 'AUTH_CODE_SEND_FAILED',
        message: '입력한 정보와 일치하는 회원정보가 없습니다.',
      });
    }

    // 본인인증 메일 옵션 설정
    const mailOptions = {
      from: process.env.EMAIL_AUTH_EMAIL,
      to: email,
      subject: '[보컬분석기] 이메일 본인인증 메일입니다.',
      html: `
        <p>본인인증 메일입니다.</p>
        <p>아래 인증코드 6자리를 입력해주세요.</p>
        <p>인증코드: <b>${emailAuthCode}</b></p>
      `,
    };

    // 본인인증 메일 전송
    const result = await transporter.sendMail(mailOptions);
    console.log('이메일 전송 성공'); 
    console.log(result);

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
    console.log('이메일 인증코드 전송 실패');
    console.error(error);
    return next(error);
  }
};

/**
 * Auth 7. 이메일 인증코드 검증
 */
exports.verifyEmailAuthCode = async () => {
  const { email, emailAuthCode } = req.body;
  const { Op } = Sequelize;

  try {
    // 이메일이 일치하고, 만료기한이 현재 시간을 지나지 않았고, 검증 완료되지 않은 데이터 중 가장 최근 데이터를 조회
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
  
    // 유효한 이메일 인증 데이터가 존재하지 않는 경우(기한 만료)
    if (!emailAuthData) {
      return res.status(200).send({
        code: 'AUTH_CODE_VERIFICATION_FAILED',
        message: '인증코드의 유효시간이 만료되었습니다. 다시 시도해 주세요.'
      });
    }
    // 인증코드가 일치하지 않는 경우
    if (emailAuthCode !== emailAuthData.emailAuthCode) {
      return res.status(200).send({
        code: 'AUTH_CODE_VERIFICATION_FAILED',
        message: '인증코드가 일치하지 않습니다.',
      });
    }

    // 해당 이메일인증 데이터 검증 완료 상태로 업데이트
    await EmailAuth.update(
      { verified: true }, 
      {
        where: { id: emailAuthData.id }
      }
    );

    return res.status(200).send({
      code: 'AUTH_CODE_VERIFICATION_SUCCEEDED',
    });
  } catch (error) {
    console.log('이메일 인증코드 검증 실패');
    console.log('MySQL(시퀄라이즈) 관련 에러 발생');
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
    console.log('아이디 찾기 실패');
    console.log('MySQL(시퀄라이즈) 관련 에러 발생');
    console.error(error);
    return next(error);
  }
};

/**
 * Auth 9. 회원정보 불러오기
 */
exports.loadProfile = async (req, res, next) => {
  const { accountName } = req.query;
  
  try {
    const userInfo = await User.findOne({ 
      where: { accountName },
      attributes: [
        'accountName', 'realName', 'birthday', 'gender', 'email'
      ],
    });

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
  // 비밀번호 변경의 경우 currentPassword가 요청 객체에 포함되나,
  // 비밀번호 찾기의 경우 그렇지 않음
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

    // 비밀번호 변경이 목적인 경우, 추가로 로그아웃 처리
    if (currentPassword) {
      const client = await connectToRedis();
      await client.select(1);

      // Redis에 로그인세션키가 남아 있다면 데이터 삭제
      const redisLoginSessionKey = await client.get(`loginSessionKey:${accountName}`);
      if (redisLoginSessionKey) await client.del(`loginSessionKey:${accountName}`);
    
      // Redis에 리프레시 토큰이 남아 있다면 데이터 삭제
      const redisRefreshToken = await client.get(`refreshToken:${accountName}`);
      if (redisRefreshToken) await client.del(`refreshToken:${accountName}`);

      await client.quit();
    }

    return res.status(200).send({
      code: 'CHANGE_PASSWORD_SUCCEEDED',
      message: '비밀번호가 변경되었습니다. 다시 로그인 해주세요.',
    });

  } catch (error) {
    console.log('비밀번호 변경(찾기) 실패');
    console.error(error);
    return next(error);
  }
};

/**
 * Auth 11. 이메일 변경
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
    console.log('이메일 변경 실패');
    console.log('MySQL(시퀄라이즈) 관련 에러 발생');
    console.error(error);
    return next(error);
  }
};
