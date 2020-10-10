const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
  },
  name: {
    type: String,
  },
  passwordHash: String,
});

userSchema.plugin(uniqueValidator);

userSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret, _options) => {
    // eslint-disable-next-line no-underscore-dangle, no-param-reassign
    delete ret._id;
    // eslint-disable-next-line no-param-reassign
    delete ret.passwordHash;
    return ret;
  },
});

module.exports = mongoose.model('User', userSchema);
