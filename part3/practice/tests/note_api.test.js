const supertest = require('supertest');
const mongoose = require('mongoose');

const Note = require('../models/note');
const app = require('../app');

const api = supertest(app);

const initialNotes = [
    {
        content: 'Easy note',
        important: true,
    },
    {
        content: 'Easy javaScript',
        important: true,
    },
];

beforeEach(async () => {
    // Note: Remember `await`
    await Note.deleteMany({});

    let newNote = new Note(initialNotes[0]);
    await newNote.save();

    newNote = new Note(initialNotes[1]);
    await newNote.save();
})

describe('note api', () => {
    test('response is json', async () => {
        // w/o async/await this will not fail
        // when it should fail, since .expect()s will not get a chance to run
        await api
            .get('/api/notes')
            .expect(200)
            .expect('Content-Type', /json/)
            // .end();
        // Note: Got error when I have async/await w/ end():
        // > both .end() and .then() were called. Never call
        // > .end() if you use promises
        // TODO: ToExplain: But in supertest readme we got above example
        // for vanilla JS - without async/await.
        // Here, when we have .end() w/o async/await we get another error:
        // > TypeError: Cannot read property 'call' of undefined, this test passes
        // but last 'content of 1st note' test fails.
        // Jest (or/and async/await ???) seems to instrument this callback
        // somehow (with // promises?)
    });
    test('all notes are returned', async () => {
        const response = await api.get('/api/notes');
        return expect(response.body).toHaveLength(initialNotes.length);
    });
    test('contains given note', async () => {
        const response = await api.get('/api/notes');
        const contents = response.body.map((note) => note.content);
        return expect(contents).toContain('Easy note');
    });

    // to fix 'Jest did not exit one second after the test run has completed.' error
    afterAll(() => {
        mongoose.connection.close();
    });
});
