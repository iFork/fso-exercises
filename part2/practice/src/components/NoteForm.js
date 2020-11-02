import React, { useState } from 'react';

const NoteForm = ({ createNote }) => {
    const [newNote, setNewNote] = useState("a new note...");

    const handleNoteChange = (event) => {
        // console.log("handleChange called w/ event:", event.target); 
        setNewNote(event.target.value);
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log("addNote called w/ event:", event.target);
        const newNoteObj =
            {
                content: newNote,
                date: new Date().toISOString(),
                important: Math.random() > 0.5
            };
        createNote(newNoteObj);
        setNewNote('');
    }

    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor="note_title">Note:</label>
            <input 
                type="text" 
                id="note_title" 
                name="note_title" 
                value={newNote}
                onChange={handleNoteChange}/>
            <button type="submit">Add Note</button>
        </form>
    );
}

export default NoteForm
