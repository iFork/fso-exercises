
// NOTE: default state is required as redux needs to get initial state when
// `undefined` is passed as state
function noteReducer(state = [], action) {
  switch (action.type) {
    case 'INIT_NOTES':
      return action.payload
    case 'NEW_NOTE':
      return state.concat(action.payload)
    case 'TOGGLE_IMPORTANCE':
      const idToChange = action.payload.id;
      let [ noteToChange ] = state.filter(note => note.id === idToChange)
      let changedNote = {
        ...noteToChange,
        important: !noteToChange.important
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

// Action creators
// NOTE: Action creators should only return action objects, *without dispatching*
// actions to store. Otherwise *CIRCULAR dependency* comes into play 
// (reducer <-> store) with its troubles.  
// If we import here store we get CIRCULAR dependency which causes RUNTIME ERROR
// in the form of store not recognizing noteReducer function, which makes
// sense, as during Circular dependency store also gets imported before the
// reducer is defined.
function generateId () {
  return Number((Math.random() * 10000).toFixed(0));
}
export function createNote (content) {
  return {
    type: 'NEW_NOTE',
    payload: {
      id: generateId(),
      important: false,
      content
    }
  }
}

export function initializeNotes (notes) {
  return {
    type: 'INIT_NOTES',
    payload: notes
  }
}

export function toggleImportance (id) {
  return {
    type: 'TOGGLE_IMPORTANCE',
    payload: {
      id
    }
  }
}

export default noteReducer;
