const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
        minlength: 5,
    },
    date: {
        type: Date,
    },
    important: Boolean,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        // NOTE: Q: Circualar dependency ?
        // A: Yes, therefore here I use model name instead of a model class
        required: true,
        // NOTE: simple `required: true` does not throw a
        // ValidationError. SINCE in the body we want
        // `userId` prop to be presnet (not `user`), which then we
        // want to map to `user`.
        //
        // When `userId` is missing we get other type of error
        // (TypeError when reading _id of not found user)
    },
});

// Formatting what schema's toJSON() will return (it is called by
// JSON.stringify() inside response.json())
// to match React's needs,
// i.e. id instead of _id and versioning property (__v) not needed

noteSchema.set('toJSON', {
    virtuals: true, // `id` is now builtin virtual property,
    // include those in output
    versionKey: false, // exclude the version key (__v) from the output
    transform: (_doc, returnedObject, _options) => {
        // eslint-disable-next-line no-underscore-dangle
        delete returnedObject._id;
        return returnedObject;
    },
});

module.exports = mongoose.model('Note', noteSchema);
