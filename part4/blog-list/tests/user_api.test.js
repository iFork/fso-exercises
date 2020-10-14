// const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const User = require('../models/user');
const helper = require('./test_helper');

const api = supertest(app);

describe('user api with some initial users in db', () => {
  beforeEach(async () => {
    await User.deleteMany({});
    await helper.initUsersDb();
  });
  test('initial db state', async () => {
    const users = await helper.usersInDb();
    // console.log(users);
    expect(users).toHaveLength(helper.initialUsers.length);
    expect(users[0].username).toBe(helper.initialUsers[0].username);
    expect(users[0].name).toBe(helper.initialUsers[0].name);
  });
  describe('user creation', () => {
    test('user w valid data can be created', async () => {
      const usersAtStart = await helper.usersInDb();
      const user = {
        username: 'testuser',
        password: 'testuserpass',
        name: 'Test User',
      };
      const response = await api
        .post('/api/users')
        .send(user)
        .type('json')
        .expect(201)
        .expect('Content-Type', /json/);
      const userInResponse = response.body; // as parsed by superagent
      expect(userInResponse).toMatchObject({
        username: 'testuser',
        name: 'Test User',
      });
      expect(userInResponse.password).not.toBeDefined();

      const usersAtEnd = await helper.usersInDb();
      expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);
    });
    test('user w not valid data cannot be created', async () => {
      const usersAtStart = await helper.usersInDb();
      const user = {
        username: 'testuser',
        password: 'te',
        name: 'Test User',
      };
      const response = await api
        .post('/api/users')
        .send(user)
        .type('json')
        .expect(400)
        .expect('Content-Type', /json/);
      expect(response.body.error).toBeDefined();

      const usersAtEnd = await helper.usersInDb();
      expect(usersAtEnd).toHaveLength(usersAtStart.length);
    });
  });
});

afterAll(() => {
  mongoose.connection.close();
});
