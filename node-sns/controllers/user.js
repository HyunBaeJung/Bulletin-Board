const User = require('../models/user');

/*
exports.userRouter = async (req, res, next) => {
  console.log(req.body);
  res.json('OK');
}
*/



/////////////////////// test ////////////////////////

exports.getUser = (req, res, next) => {
  try {
    console.log(req.query.ID);
    res.send(`${req.query.ID}`);
  } catch (error) {
    console.error('test error');
    next(error);
  } 
}

exports.postUser = (req, res, next) => {
  try {
    console.log(req.body.firstName);
    console.log(req.body.lastName);
    return res.send(`${req.body.firstName} ${req.body.lastName}`);
  } catch (error) {
    console.error('test error');
    next(error);
  } 
}

/////////////////////// test ////////////////////////



exports.follow = async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { id: req.user.id } });
    if (user) {
      await user.addFollowing(parseInt(req.params.id, 10));
      res.send('success');
    } else {
      res.status(404).send('no user');
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
};