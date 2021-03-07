function Note ({ note }) {
  return (
    <div>
      {note.content} {note.important ? <strong>Important</strong> : ''}
    </div>
  );
}

export default Note;
