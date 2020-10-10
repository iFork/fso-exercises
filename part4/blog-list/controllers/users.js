const usersRouter = require('express').Router();
const bcrypt = require('bcrypt');

const User = require('../models/user');

usersRouter.post('/', async (req, res, next) => {
  const { username, name, password } = req.body;
  console.log('Creating user w:', { username, name, password });
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
  const users = await User.find({});
  res.json(users);
});

module.exports = usersRouter;
