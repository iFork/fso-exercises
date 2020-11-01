import React from 'react';

const NoteForm = ({ newNote, handleNoteChange, handleSubmit }) => (         
    <form onSubmit={handleSubmit}>
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

export default NoteForm
