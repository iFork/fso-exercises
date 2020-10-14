const supertest = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const helper = require('./test_helper');
const User = require('../models/user');

const api = supertest(app);

describe('login', () => {
  beforeEach(async () => {
    await User.deleteMany({});
    await helper.initUsersDb();
  });
  test('user can login and get token', async () => {
    const { username, password } = helper.initialUsers[0];

    const loginResponse = await api
      .post('/api/login')
      .send({ username, password })
      .type('json')
      .expect(200)
      .expect('Content-Type', /json/);

    const { token } = loginResponse.body;
    expect(token).toBeDefined();
  });
  test('invlid login attempt fails', async () => {
    const { username } = helper.initialUsers[0];

    const loginResponse = await api
      .post('/api/login')
      .send({ username, password: 'wrongpass' })
      .type('json')
      .expect(401)
      .expect('Content-Type', /json/);

    const { body } = loginResponse;
    expect(body.error).toBeDefined();
  });
});

afterAll(() => {
  mongoose.connection.close();
});
