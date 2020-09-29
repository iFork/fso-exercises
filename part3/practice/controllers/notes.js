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

notesRouter.get('/:id', async (req, res, next) => {
    const { id } = req.params;
    logger.info('id to LU:', id);
    const note = await Note.findById(id)
        .orFail(); // w/o callback will throw a DocumentNotFoundError
    // NOTE: use orFail() to avoid 'null' or '[]' result check
    res.json(note);
});

notesRouter.delete('/:id', async (req, res, next) => {
    const { id } = req.params;
    const deletedNote = await Note.findByIdAndRemove(id);
    if (deletedNote) {
        return res.status(204).end();
    }
    return res.status(404).end(); // use better status code
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
    const note = new Note({
        content: body.content,
        important: body.important || false,
        date: new Date(),
    });
    const savedNote = await note.save();
    res.json(savedNote.toJSON());
    logger.info('posted:', savedNote);
});

module.exports = notesRouter;
