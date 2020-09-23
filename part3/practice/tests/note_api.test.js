const supertest = require('supertest');
const mongoose = require('mongoose');

const app = require('../app');

const api = supertest(app);

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
    test('response has 1 note', async () => {
        const response = await api.get('/api/notes');
        return expect(response.body).toHaveLength(1);
    });
    test('content of 1st note', async () => {
        const response = await api.get('/api/notes');
        return expect(response.body[0].content).toBe('Easy note');
    });

    // to fix 'Jest did not exit one second after the test run has completed.' error
    afterAll(() => {
        mongoose.connection.close();
    });
});
