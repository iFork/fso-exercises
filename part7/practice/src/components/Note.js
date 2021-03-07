import { useParams } from 'react-router-dom';

function Note ({ notes }) {
  const { id } = useParams();
  const note = notes.find(n => n.id === Number(id))
  return (
    <div>
      <h2>{note.content}</h2> 
      <div>{note.user}</div>
      <div>{note.important ? <strong>Important</strong> : ''}</div>
    </div>
  );
}

export default Note;
