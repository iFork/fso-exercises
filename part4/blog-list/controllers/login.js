const loginRouter = require('express').Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const User = require('../models/user');

loginRouter.post('/', async (req, res, next) => {
  const { username, password } = req.body;
  // TODO: streamline errors
  if (!username || !password) {
    return res.status(400).json({
      error: 'Username or password is missing',
    });
  }
  const user = await User
    // NOTE: REMEBER: use findOne(), find() returns Array!
    .findOne({ username });
    // .orFail();
  // console.log('user', user);

  // NOTE: REMEBER to check user for null before reading its field
  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(password, user.passwordHash);
  if (!passwordCorrect) {
    return res.status(401).json({
      error: 'Username or password is invalid',
    });
  }

  // eslint-disable-next-line no-underscore-dangle
  const userPayload = { id: user._id, username };
  // TODO: make async via adding callback ?
  const token = jwt.sign(userPayload, process.env.SECRET);

  return res.json({
    token,
    username,
    name: user.name,
    // eslint-disable-next-line no-underscore-dangle
    id: user._id,
  });
});

module.exports = loginRouter;
