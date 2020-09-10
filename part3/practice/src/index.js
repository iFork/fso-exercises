// using dotenv to get env variables set in .env file
require('dotenv').config();

// const http = require('http');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose'); // for error type checking
// mongoose models
const Note = require('./models/note');

const app = express();

// middleware to serve static pages, for our frontend
app.use(express.static('build'));

// cors middleware to allow cross-origin access from any origin
app.use(cors());

app.use(express.json());
const requestLogger = (req, _res, next) => {
    console.log('baseUrl   : ', req.baseUrl);
    console.log('method    : ', req.method);
    console.log('path      : ', req.path);
    console.log('body      : ', req.body);
    console.log('---');
    next();
};

app.use(requestLogger);

app.get('/', (_req, res) => {
    res.send('<h1>Hello World</h1>');
});

app.get('/api/notes', (_req, res) => {
    Note.find({})
        .then((notes) => {
            res.json(notes);
        });
});

app.get('/api/notes/:id', (req, res, next) => {
    // const id = Number(req.params.id);
    const { id } = req.params;
    console.log('id to LU:', id);
    // const note = notes.find(note => note.id === id);
    Note.findById(id)
        .orFail() // w/o callback will throw a DocumentNotFoundError
        .then((note) => {
            // NOTE: use orFail() to avoid 'null' or '[]' result check
            res.json(note);
            // if (note) res.json(note);
            // // if not found, find returns null, not rejected promise
            // else res.status(404).end();
        })
        .catch((err) => next(err));
});

app.delete('/api/notes/:id', (req, res, next) => {
    const { id } = req.params;
    // notes = notes.filter(note => note.id !== id);
    Note.findByIdAndRemove(id)
        .then((deletedNote) => {
            if (deletedNote) {
                return res.status(204).end();
            }
            return res.status(404).end(); // use better status code
        })
        .catch((err) => next(err));
});

app.put('/api/notes/:id', (req, res, next) => {
    const { id } = req.params;
    const { body } = req;
    const note = {
        content: body.content,
        important: body.important,
    };
    Note.findByIdAndUpdate(id, note, { new: true })
        .then((updatedNote) => {
            res.json(updatedNote);
        })
        .catch((err) => next(err));
});

app.post('/api/notes', (req, res, next) => {
    const { body } = req;
    // if (!body.content) {
    //     return res.status(400).json({
    //         error: "Content missing"
    //     });
    // }
    const note = new Note({
        content: body.content,
        important: body.important || false,
        date: new Date(),
    });
    note.save()
        .then((savedNote) => {
            res.json(savedNote);
            console.log('posted:', savedNote);
        })
        // catch validation errors
        .catch((err) => next(err));
});

const unknownEndpoint = (_req, res, _next) => {
    res.status(404).send({ error: 'unknown endpoint' });
    // next();
    // here absence of next() does not cause hanging of the client
    // while next() missing in logger cause client to wait for response in vain.
    // This is because here .send() terminates the req-res cycle.
};
app.use(unknownEndpoint);

// Error handler middleware
// NOTE: if error handler middleware is 'use()'ed before a router which may
// throw an error (i.e. `next(error)`), e.g., before get(../:id) router above,
// then it has no effect and default error handler middleware of express is in
// effect.
// **NB**: Therefore always 'use()' error handler middleware at the very END.
const errorHandler = (err, _req, res, next) => {
    console.log('error :', err.message);
    if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return res.status(404).json({ error: 'Not found' });
    }
    if (err.name === 'CastError') {
        return res.status(400).json({ error: 'Malformatted id' });
    }
    if (err.name === 'ValidationError') { // or instanceof mongoose.Error.ValidationError
        // return res.status(400).json({error: err.errors});
        return res.status(400).json({ error: err.message });
    }
    return next(err);
};
app.use(errorHandler);

const port = process.env.PORT;
// app.listen(port);
// console.log(`Server running on port ${port}`);

// get heroku environmnet variable for port
app.listen(process.env.PORT || port, () => {
    console.log(`Server running on port ${port}`);
});
