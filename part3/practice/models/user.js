const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Note = require('./note');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
    },
    name: {
        type: String,
    },
    passwordHash: String,
    notes: [{
        // type: mongoose.Schema.Types.ObjectId,
        // type: mongoose.Types.ObjectId,
        type: mongoose.ObjectId,
        ref: Note,
        // NOTE: use model name (e.g. 'Name') instead of model class (e.g. Name)
        // in case Circualar Dependency is created.
    }],
});

userSchema.plugin(uniqueValidator);

userSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: (_doc, ret, _options) => {
        // eslint-disable-next-line no-param-reassign, no-underscore-dangle
        delete ret._id;
        // eslint-disable-next-line no-param-reassign
        delete ret.passwordHash;
        return ret;
    },
});

module.exports = mongoose.model('User', userSchema);
