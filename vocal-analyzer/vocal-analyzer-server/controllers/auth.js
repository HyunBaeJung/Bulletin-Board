exports.login = (req, res, next) => {
  // const { email, password } = req.body;

  try {
    // 1단계 테스트
    return res.status(200).send({
      testResult: '성공!'
    });
    // 2단계 테스트
    /*
    return res.status(200).send({
      testResult: '성공!',
      emailTest: email,
      passwordTest: password,
    });
    */
  } catch (error) {
    console.error(error);
    return next(error);
  }
}
