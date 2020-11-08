import React from 'react'

const Note = (props) => {
  const { note, toggleImportance } = props
  const label = note.important ? 'Make not important' : 'Make important'
  return (
    <li className="note">
      {note.content}
      <button type="button" onClick={toggleImportance}>{label}</button>
    </li>
  )
}

// export { Note as default };
export default Note

