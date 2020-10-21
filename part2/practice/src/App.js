import React, { useState, useEffect} from 'react';
import Note from "./components/Note";
import Notification from "./components/Notification";
import Footer from "./components/Footer";
import LoginForm from "./components/LoginForm";
import noteService from "./services/notes";
import loginService from "./services/login";

const App = () => {
    const [notes, setNotes] = useState([]);
    const [newNote, setNewNote] = useState("a new note...");
    const [showAll, setShowAll] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [user, setUser] = useState(null);

    const hook = () => {
        console.log("Effect");
        noteService
            .getAll()
            .then(initialNotes => {
                console.log("response is:", initialNotes);
                setNotes(initialNotes);
            });
    }

    // hook();
    useEffect(hook, []);
    // use user from localStorage if exists
    useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem("loggedNoteappUser");
        if (loggedUserJSON) {
            console.log('Effect: read user data from localStorage');
            const user = JSON.parse(loggedUserJSON);
            setUser(user);
            noteService.setToken(user.token)
        }
    }, [])
    console.log("render", notes.length, "notes");

    const handleLogin = async (event) => {
        // prevent default submit ('get' request and reload)
        event.preventDefault();
        // Q: Can values in DOM be stale compared to values in state?
        // A: No, since we get dom value on change and pass it to setState.
        const {
            username: { value: username },
            password: { value: password },
        } = event.target;
        // console.log('Logging in', username, password);
        try {
            const user = await loginService.login({ username, password });
            setUser(user);
            noteService.setToken(user.token);
            const loggedUserJSON = JSON.stringify(user);
            window.localStorage.setItem("loggedNoteappUser", loggedUserJSON);
            setUsername("");
            setPassword("");
        } catch (err) {
            const errorMsg = err.response && err.response.data
                ? err.response.data.error || err.response.statusText
                : `Internal Error: ${err.message}`
                // : `Internal Error: ${err.message}`
            // const errorMsg = err.response.statusText;
            setErrorMessage(errorMsg);
            setTimeout(() => setErrorMessage(null), 5000 );
        }
    };

    const notesToShow = showAll 
        ? notes 
        : notes.filter(note => note.important);

    const addNote = (event) => {
        event.preventDefault();
        console.log("addNote called w/ event:", event.target);
        const newNoteObj =
            {
                // id: notes.length + 1,
                // NOTE: Q: Why keeping `id` breaks subsequent posts after initial success
                // Does json-server enforce uniqueness on `id`s and `.length` is loosing uniqueness
                // as we are note updating state? Yes, Correct!!
                // > omit the *id* property, since it's better to let the server generate ids for our resources
                content: newNote,
                date: new Date().toISOString(),
                important: Math.random() > 0.5
            };
        noteService
            .create(newNoteObj) 
            .then(returnedNote => {
                console.log("post fulfilled, response is", returnedNote);
                setNotes(notes.concat(returnedNote));   
            });
        setNewNote('');
        
    }

    const handleNoteChange = (event) => {
        console.log("handleChange called w/ event:", event.target); 
        setNewNote(event.target.value);
    }

    const addNoteForm = () => (         
        <form onSubmit={addNote}>
            <label htmlFor="note_title">Note:</label>
            <input 
                type="text" 
                id="note_title" 
                name="note_title" 
                value={newNote}
                // defaultValue={newNote} // NOTE: field is editable, but
                // edits do not pass to e.target.value
                onChange={handleNoteChange}/>
            <button type="submit">Add Note</button>
        </form>
    );

    const toggleImportance = (id) => {
        console.log(`toggle importance of ${id}'th note`);
        const note = notes.find(n => n.id === id);
        const changedNote = {...note, important: !note.important};
        noteService
            .update(id, changedNote)
            .then(returnedNote => 
                setNotes(notes.map(note => note.id === id ? returnedNote : note)))
            .catch(err => {
                console.log("failed w/ error:", err);
                setErrorMessage(
                    `Note '${note.content}' was already removed from the server`);
                setTimeout(() => setErrorMessage(null), 5000);
                // alert(`Note "${note.content}" already has been deleted from the server`);
                setNotes(notes.filter(note => note.id !== id));
            })
    }
    return (
        <div>
            <h1>Notes</h1>
            <Notification message={errorMessage} />

            {/* below both a functional component 'style' and a helper function
            'style' are used, just for display of diversity */}
            {/* { user && addNoteForm() } */}
            { user === null 
                ? <LoginForm
                    loginHandler={handleLogin}
                    username={username}
                    setUsername={setUsername}
                    password={password}
                    setPassword={setPassword}
                />
                : <div>
                    <p> Logged in as {user.username}</p>
                    { addNoteForm() }
                </div>
            }
            <button type="button" onClick={() => setShowAll(!showAll)}>
                Show {showAll ? "Important" : "All"}
            </button>
            <ul>
                { notesToShow.map(note => 
                    <Note 
                        key={note.id} 
                        note={note} 
                        toggleImportance={() => toggleImportance(note.id)} />
                )}
            </ul>
            <Footer />
        </div>
    );
}

export default App;
