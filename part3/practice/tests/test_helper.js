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

//get notes in DB
const notesInDb = async () => {
    const response = await api.get('/api/notes');
    return response.body; // response json parsed by superagent
    // (of supertest)

};

module.exports = {
    initialNotes,
    notesInDb,
};
