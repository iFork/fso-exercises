
const mongoose = require('mongoose');
// global configs for mongoose
// to settle deprecation warnings
mongoose.set('useFindAndModify', false);

//MongoDB connection string
// const password = process.argv[2];
// const user = 'fso';
// const dbname = 'note-app';
// const uri = `mongodb+srv://${user}:${password}@cluster0.ubqcg.mongodb.net/`
            // + `${dbname}?retryWrites=true&w=majority`;

//dotenv is used to get env variables
const uri = process.env.MONGODB_URI;
console.log("connecting to", uri);

mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => console.log("connected to MongoDB"))
    .catch((err) => console.log("error connecting to MongoDB:", err.message));
    //TODO: lookup mongoose connect error ?

const noteSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
        minlength: 5
    },
    date: {
        type: Date,
        required: true
    },
    important: Boolean
});

// Formatting what schema's toJSON() will return (it is called by
// JSON.stringify() inside response.json())
// to match React's needs, 
// i.e. id instead of _id and versioning property (__v) not needed

noteSchema.set('toJSON', {
    virtuals: true, // `id` is now builtin virtual property, 
                    // include those in output
    versionKey: false, // exclude the version key (__v) from the output
    transform : (doc, returnedObject, options) => {
        delete returnedObject._id;
        return returnedObject;
    }
})

module.exports = mongoose.model('Note', noteSchema);

