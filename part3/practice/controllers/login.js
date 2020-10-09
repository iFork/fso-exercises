const loginRouter = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

loginRouter.post('/', async (req, res, next) => {
    // username, password
    const { username, password } = req.body;
    const user = await User
        .findOne({ username })
        // .orFail();
    // NOTE: first check user is found (not null) since
    // we want to read a prop from user next
    const passwordIsCorrect = user === null
        ? false
        : await bcrypt.compare(password, user.passwordHash);

    if (!passwordIsCorrect) {
        return res
            .status(401)
            .json({ error: 'Username or passord is invalid' });
        // TODO: OR throw error for next(err) or express-async-error
    }
    const tokenPayload = {
        username,
        id: user._id,
    };
    const token = jwt.sign(tokenPayload, process.env.SECRET);
    // NOTE: in jwt, async is only via callbacks, not promises (so no await)
    return res
        .status(200)
        .json({
            token,
            username,
            name: user.name,
            // NOTE: We can NOT spread ...user here since
            // then `toJSON` specialization of `user` will not play a role
            // here (omiting passwordHash, adjusting _id, __v fields)
            //
            // Note:  may explore json(arg1, arg2) signature
            // or json({...JSON.parse(obj1.toJSON()), ...obj2})
        });
});

module.exports = loginRouter;
