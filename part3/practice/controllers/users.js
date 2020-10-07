const usersRouter = require('express').Router();
const bcrypt = require('bcrypt');

const User = require('../models/user');

usersRouter.get('/', async (_req, res, _next) => {
    const users = await User
        .find({})
        .populate('notes', { content: 1, important: 1 });
    res.json(users);
});

usersRouter.post('/', async (req, res, _next) => {
    const { body } = req;
    const passwordHash = await bcrypt.hash(body.password, 10);
    const userObj = new User({
        username: body.username,
        name: body.name,
        passwordHash,
    });
    const savedUser = await userObj.save();
    // NOTE: to populate existing document use
    // .populate(...).execPopulate()
    await savedUser
        .populate('notes', { content: 1, important: 1 })
        .execPopulate();
    // console.log('savedUser', savedUser);
    res.status(201).json(savedUser);
});

module.exports = usersRouter;
