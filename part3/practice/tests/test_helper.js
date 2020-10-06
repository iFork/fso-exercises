const supertest = require('supertest');

const app = require('../app');

const api = supertest(app);
// initial notes

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

const notesInDb = async () => {
    const response = await api.get('/api/notes');
    return response.body; // response json parsed by superagent
    // (of supertest)
};

const initialUsers = [{
    username: 'root',
    name: 'Superuser',
    password: 'secretenigma',
},
];

const usersInDb = async () => {
    const response = await api.get('/api/users');
    return response.body;
};

module.exports = {
    initialNotes,
    notesInDb,
    initialUsers,
    usersInDb,
};
