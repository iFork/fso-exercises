import { Link } from 'react-router-dom';

export default function Notes ({ notes }) { 
  return ( 
    <ul>
      {notes.map(note => {
        return (
          <li key={note.id}>
            <Link to={`/notes/${note.id}`}>{note.content}</Link>
          </li>
        );
      })}
    </ul>
  );
}

