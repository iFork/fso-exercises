import Note from './Note';
// import noteService from './services/noteService';


export default function Notes ({ notes }) { 
  return ( 
    <ul>
      {notes.map(note => {
        return (
          <li key={note.id}>
            <Note
              note={note}
            />
          </li>
        );
      })}
    </ul>
  );
}

