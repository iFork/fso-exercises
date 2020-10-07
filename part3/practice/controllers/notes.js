/* eslint-disable no-underscore-dangle */
const notesRouter = require('express').Router();
const mongoose = require('mongoose');
const Note = require('../models/note');
const User = require('../models/user');
const logger = require('../utils/logger');

notesRouter.get('/', async (_req, res) => {
    const notes = await Note
        .find({})
        .populate('user', { username: 1, name: 1 });
    res.json(notes);
    // res.json(notes.map((note) => note.toJSON()));
});

notesRouter.get('/:id', async (req, res, _next) => {
    const { id } = req.params;
    logger.info('id to LU:', id);
    const note = await Note
        .findById(id)
        .populate('user', { username: 1, name: 1 })
        .orFail(); // w/o callback will throw a DocumentNotFoundError
    // NOTE: use orFail() to avoid 'null' or '[]' result check
    res.json(note);
});

notesRouter.delete('/:id', async (req, res, _next) => {
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
        .populate('user', { username: 1, name: 1 })
        .then((updatedNote) => {
            res.json(updatedNote);
        })
        .catch((err) => next(err));
});

notesRouter.post('/', async (req, res, _next) => {
    const { body } = req;
    // user
    const user = await User
        .findById(body.userId)
        .orFail(() => {
            const e = new Error('Valid userId is required');
            e.name = 'userIdError';
            return e;
        });
        // we need this to make `userId` required
        // BUT instead of DocumentNotFoundError we want more
        // specific error
    const note = new Note({
        content: body.content,
        important: body.important || false,
        date: new Date(),
        user: user._id,
    });
    const savedNote = await note.save();
    await savedNote
        .populate('user', { username: 1, name: 1 })
        .execPopulate();
    user.notes = user.notes.concat(savedNote._id);
    await user.save();
    logger.info('posted:', savedNote);
    res.json(savedNote.toJSON());
});

module.exports = notesRouter;
