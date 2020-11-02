import React, { useState, useEffect} from 'react';
import Note from "./components/Note";
import Notification from "./components/Notification";
import Footer from "./components/Footer";
import Togglable from "./components/Togglable";
import LoginForm from "./components/LoginForm";
import NoteForm from "./components/NoteForm";
import noteService from "./services/notes";
import loginService from "./services/login";

const App = () => {
    const [notes, setNotes] = useState([]);
    const [showAll, setShowAll] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
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


    const login = async (userCredentials) => {
        try {
            const user = await loginService.login(userCredentials);
            setUser(user);
            noteService.setToken(user.token);
            const loggedUserJSON = JSON.stringify(user);
            window.localStorage.setItem("loggedNoteappUser", loggedUserJSON);
        } catch (err) {
            const errorMsg = err.response && err.response.data
                ? err.response.data.error || err.response.statusText
                : `Internal Error: ${err.message}`
            setErrorMessage(errorMsg);
            setTimeout(() => setErrorMessage(null), 5000 );
        }
    }

    const notesToShow = showAll 
        ? notes 
        : notes.filter(note => note.important);


    const createNote = (newNoteObj) => {
        noteService
            .create(newNoteObj)
            .then(returnedNote => {
                console.log("post fulfilled, response is", returnedNote);
                setNotes(notes.concat(returnedNote));
            });
    }

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

            {/* { user && addNoteForm() } */}
            { user === null 
                ? <Togglable buttonLabel="Login">
                    <LoginForm 
                        loginCb={login}
                    />
                </Togglable>
                : <div>
                    Logged in as {user.username}
                    <button
                      type="button"
                      onClick={() => {
                        setUser(null)
                        window.localStorage.clear()
                      }}>
                      Logout
                    </button>
                    <Togglable buttonLabel="Add Note">
                        <NoteForm
                            createNote={createNote}
                        />
                    </Togglable>
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
