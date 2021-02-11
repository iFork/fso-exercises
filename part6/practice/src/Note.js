function Note ({ note, handleImportanceToggling }) {
  return (
    <div onClick={handleImportanceToggling}>
      {note.content} {note.importance ? <strong>Important</strong> : ''}
    </div>
  )
}

export default Note;
