
// const http = require('http');
const express = require('express');
const cors = require('cors');

let notes = [
  {
    id: 1,
    content: "HTML is easy",
    date: "2019-05-30T17:30:31.098Z",
    important: true
  },
  {
    id: 2,
    content: "Browser can execute only Javascript",
    date: "2019-05-30T18:39:34.091Z",
    important: false
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    date: "2019-05-30T19:20:14.298Z",
    important: true
  }
];


// const app = http.createServer((req, res) => {
//     res.writeHead(200, {'Content-Type': 'application/json'});
//     res.end(JSON.stringify(notes));
// })

const app = express();

//middleware to serve static pages, for our frontend
app.use(express.static('build'));

//cors middleware to allow cross-origin access from any origin
app.use(cors());

app.use(express.json());
const requestLogger = (req,res,next) => {
    console.log("baseUrl   : ", req.baseUrl);
    console.log("method    : ", req.method);
    console.log("path      : ", req.path);
    console.log("body      : ", req.body);
    console.log("---");
    next();
}

app.use(requestLogger);

app.get('/', (req,res) => {
    res.send('<h1>Hello World</h1>');
});

app.get('/api/notes', (req,res) => {
    res.json(notes);
});

app.get('/api/notes/:id', (req,res) => {
    const id = Number(req.params.id);
    console.log("id to LU:", id);
    const note = notes.find(note => note.id === id);
    if (note) {
        res.json(note);
    }
    else {
        res.status(404).end();
    }
})

app.delete('/api/notes/:id', (req,res) => {
    const id = Number(req.params.id);
    notes = notes.filter(note => note.id !== id);
    res.status(204).end();
})

const generateId = () => {
    let maxId = notes.length
                    ? Math.max(...notes.map(n => n.id)) 
                    : 0;
    return ++maxId;
}

app.post('/api/notes', (req, res) => {
    const body = req.body;
    if (!body.content) {
        return res.status(400).json({
            error: "Content missing"
        });   
    }
    const note = {
        content: body.content,
        important: body.important || false,
        date: new Date(),
        id: generateId()
    }
    console.log("posted:", note);
    notes.push(note);
    res.json(note);
})

const unknownEndpoint = (req,res,next) => {
    res.status(404).send({error: "unknown endpoint"});
    // next();
    // here absence of next() does not cause hanging of the client 
    // while next() missing in logger cause client to wait for response in vain.
    // This is because here .send() terminates the req-res cycle.
};
app.use(unknownEndpoint);

const port = 3001;
// app.listen(port);
// console.log(`Server running on port ${port}`);

// get heroku environmnet variable for port
app.listen(process.env.PORT || port, () => {
    console.log(`Server running on port ${port}`);
});

