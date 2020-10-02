const supertest = require('supertest');
const mongoose = require('mongoose');

const Note = require('../models/note');
const app = require('../app');
const helper = require('./test_helper');

const api = supertest(app);

describe('note api when there are some initial notes', () => {
    beforeEach(async () => {
        // Note: Remember `await`
        await Note.deleteMany({});

        // NOTE: puting async callback in forEach() gets
        // unreliable / erroneous results.
        // Due to it, 1st test passed but 2nd test sometimes passed
        // (when I added console.log() lines), sometimes no,
        // and each time resultant state may differ.
        //
        // helper.initialNotes.forEach(async (note) => {
        //     const newNote = new Note(note);
        //     await newNote.save();
        // });

        const noteObjects = helper.initialNotes
            .map((note) => new Note(note));
        const promiseArray = noteObjects
            .map(/* async */ (noteObj) => noteObj.save());
        await Promise.all(promiseArray);
    });
    // get route
    test('response is json', async () => {
        // w/o async/await this will not fail
        // when it should fail, since .expect()s will not get a chance to run
        await api
            .get('/api/notes')
            .expect(200)
            .expect('Content-Type', /json/);
        // .end();
        //
        // Note: Got error when I have async/await w/ end():
        // > both .end() and .then() were called. Never call
        // > .end() if you use promises
        // TODO: To-Explain: But in supertest readme we got above example
        // for vanilla JS - without async/await.
        // Here, when we have .end() w/o async/await we get another error:
        // > TypeError: Cannot read property 'call' of undefined, this test passes
        // but last 'content of 1st note' test fails.
        // Jest (or/and async/await ???) seems to instrument this callback
        // somehow (with // promises?)
    });
    test('all notes are returned', async () => {
        const notes = await helper.notesInDb();
        // console.log('all notes', notes);
        expect(notes).toHaveLength(helper.initialNotes.length);
    });
    test('contains given note', async () => {
        const notes = await helper.notesInDb();
        // NOTE: Here issue was unreliable db state due to async callback
        // in forEach() of beforeEach()
        // console.log('notes', notes);
        const contents = await notes.map((n) => n.content);
        expect(contents).toContain('Easy note');
    });

    describe('adding a new note', () => {
        // post route
        test('valid note can be added', async () => {
            const note = {
                content: 'New note added',
                important: true,
            };
            // Note: Remember we are testing from front-end, mongoose model is
            // not available here! just a json! Therefore we are using
            // `supertest`
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

            const notesAtEnd = await helper.notesInDb();
            const contentsAtEnd = notesAtEnd.map((n) => n.content);

            expect(notesAtEnd).toHaveLength(helper.initialNotes.length + 1);
            expect(contentsAtEnd).toContain('New note added');
        });

        test('cannot add invalid note', async () => {
            const invalidNote = {
                important: true,
            };

            await api
                // NOTE: When path has typo (per supertest),
                // like missing '/' at the beginning
                // we get ERROR `connect ECONNREFUSED 127.0.0.1:80`
                .post('/api/notes')
                .send(invalidNote)
                .type('json')
                // .accept('json')

                .expect(400);
            // .expect('Content-Type', /json/);

            const notesAtEnd = await helper.notesInDb();

            expect(notesAtEnd).toHaveLength(helper.initialNotes.length);
        });
    });

    describe('viewing a specific note', () => {
        // route .get '/:id'
        test('view specific note', async () => {
            // get a note to use its id
            const notesAtStart = await helper.notesInDb();
            const noteToView = notesAtStart[0];

            // Here we get both response and use supertest assertions
            const response = await api.get(`/api/notes/${noteToView.id}`) // ;
            // response
            // NOTE: we chain assertions immediately
            // since they do not change object returned by get()
                .expect(200)
                .expect('Content-Type', /json/);

            expect(response.body).toEqual(noteToView);
        });

        // TODO:
        // add test for invalid id
        // add test for valid but non-existing id
    });

    describe('delete spcific note', () => {
        // route delete '/:id'
        test('delete specific note', async () => {
            // get a note to use its id for deletion
            const notesAtStart = await helper.notesInDb();
            const noteToDelete = notesAtStart[0];

            // verify response
            await api
                .delete(`/api/notes/${noteToDelete.id}`)
                .expect(204);

            // verify deletion in db
            const notesAtEnd = await helper.notesInDb();
            expect(notesAtEnd).toHaveLength(notesAtStart.length - 1);
            expect(notesAtEnd).not.toContainEqual(noteToDelete);
        });
    });
});


// Remaining routes to test:
// .put('/:id', (req, res, next) => {

// to fix 'Jest did not exit one second after the test run has completed.' error
afterAll(() => {
    mongoose.connection.close();
});
