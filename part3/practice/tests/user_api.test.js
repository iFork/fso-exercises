const mongoose = require('mongoose');
const supertest = require('supertest');
const bcrypt = require('bcrypt');

const app = require('../app');
const User = require('../models/user');

const helper = require('./test_helper');

const api = supertest(app);

describe('test user api when there is an initial user in db', () => {
    beforeEach(async () => {
        // clean
        await User.deleteMany({});
        // create a user, save
        const saltRounds = 10;
        const userPromises = helper.initialUsers.map(async (user) => {
            const passwordHash = await bcrypt.hash(user.password, saltRounds);
            // ~~~~~~~~~~~~~~~~~~^
            // NOTE: When `await` is present above, we get
            // `Promise { <pending> }` returned for elements in the resultant
            // array.
            // I.e. 1 promise, only.
            // Which resolves fully, without leaving nested unresolved promises.
            //
            // BUT, When above line is withOUT `await` - we get
            // `Promise { ...<others>, passwordHash: Promise {<pending>} }`.
            // Seems like 2 promises (1 nested).
            // In this case, `await Promise.all(..)` - we get only 1st/outer
            // promise resolved, but nested promise remains pending!
            //
            // In each case, when such element is passed to db object c-tor w/o
            // awaiting for resolution, it is like passing empty or wrong
            // object to it. I.e. db object gets created w/ 'default' fields.
            const userHashed = {
                username: user.username,
                name: user.name,
                passwordHash,
            };
            return userHashed;
        });
        const users = await Promise.all(userPromises);
        const userSavePromises = users.map((user) => {
            const userObj = new User(user);
            // console.log('user', user);
            // console.log('userObj', userObj);
            return userObj.save();
        });
        await Promise.all(userSavePromises);
    });
    describe('creating a new user', () => {
        test('a new user w fresh username created w correct response',
            async () => {
                const user = {
                    username: 'freshman',
                    name: 'Walter',
                    password: 'superpassword',
                };
                const response = await api
                    .post('/api/users')
                    .send(user)
                    .type('json')
                    .expect(201)
                    .expect('Content-Type', /json/);
                const { body } = response;
                expect(body.password).not.toBeDefined();
                expect(body.passwordHash).not.toBeDefined();
                expect(body.username).toBe(user.username);
                expect(body.name).toBe(user.name);
                const usersAtEnd = await helper.usersInDb();
                expect(usersAtEnd).toHaveLength(helper.initialUsers.length + 1);
                const usernames = usersAtEnd.map((u) => u.username);
                expect(usernames).toContain('freshman');
            });
        test('creation fails if username is taken', async () => {
            const usersAtStart = await helper.usersInDb();

            const user = {
                username: helper.initialUsers[0].username,
                name: 'Any Name',
                password: 'suresecret',
            };
            const response = await api
                .post('/api/users')
                .send(user)
                .expect(400)
                .expect('Content-Type', /json/);

            // expect(response.body.error).toContain('`username` to be unique');
            expect(response.body.error).toMatch(/username.*unique/);
            const usersAtEnd = await helper.usersInDb();
            expect(usersAtEnd).toHaveLength(usersAtStart.length);
        });
    });
});

afterAll(() => {
    mongoose.connection.close();
});
