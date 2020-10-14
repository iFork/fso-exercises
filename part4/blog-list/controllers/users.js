const usersRouter = require('express').Router();
const bcrypt = require('bcrypt');

const User = require('../models/user');

usersRouter.post('/', async (req, res, next) => {
  const { username, name, password } = req.body;
  // console.log('Creating user w:', { username, name, password });
  if (!password || password.length < 3) {
    return res.status(400).json({
      error: 'Password with min length of 3 is required',
    });
  }
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);
  const user = new User({
    username,
    name,
    passwordHash,
  });
  const savedUser = await user.save();
  res.status(201).json(savedUser);
});

usersRouter.get('/', async (req, res, next) => {
  const users = await User
    .find({})
    .populate('blogs', {
      title: 1,
      author: 1,
      url: 1,
      likes: 1,
    });
  res.json(users);
});

module.exports = usersRouter;
