function noteReducer(state = [], action) {
  switch (action.type) {
    case 'NEW_NOTE':
      return state.concat(action.payload)
    case 'TOGGLE_IMPORTANCE':
      const idToChange = action.payload.id;
      let [ noteToChange ] = state.filter(note => note.id === idToChange)
      let changedNote = {
        ...noteToChange,
        importance: !noteToChange.importance
      }
      return state.map(note => {
        return note.id === idToChange ? changedNote : note
      })
    case 'DELETE_ALL':
      return [];
    default:
      return state;
  }
}

export default noteReducer;
