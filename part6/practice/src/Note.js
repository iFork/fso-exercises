function Note ({ note, handleImportanceToggling }) {
  return (
    <div onClick={handleImportanceToggling}>
      {note.content} {note.important ? <strong>Important</strong> : ''}
    </div>
  )
}

export default Note;
