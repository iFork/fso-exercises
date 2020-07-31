import React, { useState, useEffect} from 'react';
import Note from "./components/Note";
import Notification from "./components/Notification";
import Footer from "./components/Footer";
import noteService from "./services/notes";

const App = () => {
    const [notes, setNotes] = useState([]);
    const [newNote, setNewNote] = useState("a new note...");
    const [showAll, setShowAll] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

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
    useEffect(hook, [])
    console.log("render", notes.length, "notes");

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
            <form onSubmit={addNote}>
                <label>Note:</label>
                {/* <label for="note_title">Note:</label> */}
                {/* FIXME: Warning: Invalid DOM property `for`. */}
                <input type="text" id="note_title" name="note_title" 
                    value={newNote}
                    // defaultValue={newNote} // NOTE: field is editable, but
                                            // edits do not pass to e.target.value
                    onChange={handleNoteChange}/>
                <button type="submit">Add Note</button>
            </form>
            <Footer />
        </div>
    );
}

export default App;
