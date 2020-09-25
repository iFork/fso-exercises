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
});

describe('note api', () => {
    // get route
    test('response is json', async () => {
        // w/o async/await this will not fail
        // when it should fail, since .expect()s will not get a chance to run
        await api
            .get('/api/notes')
            .expect(200)
            .expect('Content-Type', /json/);
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

    // post route
    test('valid note can be added', async () => {
        const note = { 
            content: 'New note added',
            important: true,
        };
        // Note: Remember we are testing from front-end, mongoose model is not
        // available here! just a json! Therefore we are using `supertest`
        // const noteObj = new Note(note);
        // const response = await noteObj.save();
        // const notesAtEnd = await Note.find({});
        //
        // Post and assert posted note using supertest
        await api
            .post('/api/notes')
            .send(note) // toJSON?
            .type('json')
            .accept('json')

            .expect(200)
            .expect('Content-Type', /json/);

        const response = await api.get('/api/notes');
        const notesAtEnd = response.body; // response json parsed by superagent
        // (of supertest)
        const contentsAtEnd = notesAtEnd.map(n => n.content);

        expect(notesAtEnd).toHaveLength(initialNotes.length + 1);
        expect(contentsAtEnd).toContain('New note added');
    });

    test('cannot add invalid note', async () => {
        const invalidNote = {
            important: true,
        };

        await api
            .post('/api/notes')
            .send(invalidNote)
            .type('json')
            // .accept('json')

            .expect(400);
            // .expect('Content-Type', /json/);

        const response = await api.get('/api/notes');
        const notesAtEnd = response.body;

        expect(notesAtEnd).toHaveLength(initialNotes.length);
    });

    //     TODO: yet to test
    // .get('/:id', (req, res, next) => {
    // .delete('/:id', (req, res, next) => {
    // .put('/:id', (req, res, next) => {

    // to fix 'Jest did not exit one second after the test run has completed.' error
    afterAll(() => {
        mongoose.connection.close();
    });
});
