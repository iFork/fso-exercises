const mongoose = require('mongoose');
// global configs for mongoose
// to settle deprecation warnings
mongoose.set('useFindAndModify', false);

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
