const mongoose = require('mongoose');

// CL argument parsing - password

if (process.argv.length < 3) {
    console.log("Please provide the password as an argument: node mongo.js <password>");
    process.exit(1);
}

const password = process.argv[2];
const user = 'fso';
const dbname = 'note-app';
const uri = `mongodb+srv://${user}:${password}@cluster0.ubqcg.mongodb.net/`
            + `${dbname}?retryWrites=true&w=majority`;

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true});
    // Returns promise. If initial connection fails, Mongoose will not attempt
    // to reconnect, it will emit an 'error' event, and the promise
    // mongoose.connect() returns will reject. 
        // do .catch(error => ...)
    // If Error after initial connection was established. Mongoose will attempt
    // to reconnect, and it will emit an 'error' event 
        // listen event: mongoose.connection.on('error', err => ...)

const schema = new mongoose.Schema({
    content: String,
    date: Date,
    important: Boolean
});

// Compile model based on a schema
const Note = mongoose.model('Note', schema);
    // first argument is the singular name of the collection your model is for.
    // Mongoose automatically looks for the plural, lowercased version of your
    // model name - for the collection in the database.

// Create an instance of a model (a document), compiled model is a class / c-tor
// const note = new Note({
//     content: "Mongoose is ~ ODM ~ object document mapper",
//     date: new Date(),
//     important: true
// });

//Save a document
// callback style:
// note.save( (error, note) => {
//     if (error) console.error(error);
//     console.log('Saved -', note);
// })

// promise style:
// note.save().then( result => {
//     console.log("Save succeeded, result is ", result);
//     mongoose.connection.close();
// })

//fetch notes from Note (notes) collection
Note.find({important: true}).then( result => {
    console.log("Found important notes ---");
    result.forEach( note => {
        console.log(note);
    })
    //Close
    mongoose.connection.close();
})

