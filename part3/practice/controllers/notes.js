const notesRouter = require('express').Router();
const Note = require('../models/note');
const logger = require('../utils/logger');

notesRouter.get('/', async (_req, res) => {
    const notes = await Note.find({});
    res.json(notes);
    // res.json(notes.map((note) => note.toJSON()));
    // TODO: To-Check: Do we need the last line or in any case toJSON is called
    // implicitly behind res.json() ?
});

notesRouter.get('/:id', (req, res, next) => {
    // const id = Number(req.params.id);
    const { id } = req.params;
    logger.info('id to LU:', id);
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

notesRouter.delete('/:id', (req, res, next) => {
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

notesRouter.put('/:id', (req, res, next) => {
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

notesRouter.post('/', async (req, res, next) => {
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
    const savedNote = await note.save();
    try {
        res.json(savedNote);
        logger.info('posted:', savedNote);
    } catch (err) {
        // catch validation errors
        next(err);
    }
});

module.exports = notesRouter;
