import noteService from "../services/noteService";

// NOTE: default state is required as redux needs to get initial state when
// `undefined` is passed as state
function noteReducer(state = [], action) {
  switch (action.type) {
    case 'INIT_NOTES':
      return action.payload;
    case 'NEW_NOTE':
      return state.concat(action.payload);
    case 'TOGGLE_IMPORTANCE':
      const idToChange = action.payload.id;
      let [ noteToChange ] = state.filter(note => note.id === idToChange);
      let changedNote = {
        ...noteToChange,
        important: !noteToChange.important
      };
      return state.map(note => {
        return note.id === idToChange ? changedNote : note;
      });
    case 'DELETE_ALL':
      return [];
    default:
      return state;
  }
}

// Action creators
// OBSOLETE NOTE: Action creators should only return action objects, *without dispatching*
// actions to store. Otherwise *CIRCULAR dependency* comes into play 
// (reducer <-> store) with its troubles.  
// SOLUTION: use redux-tunk and return thunks from action creators which accept
// dispatch as param from dispatch() they will be passed to.
export function createNote (note) {
  return async function (dispatch) { 
    const newNote = await noteService.createNote(note);
    dispatch({
      type: 'NEW_NOTE',
      payload: newNote
    });
  };
}

export function initializeNotes () {
  return async function (dispatch) { 
    const notes = await noteService.getAll();
    dispatch({
      type: 'INIT_NOTES',
      payload: notes
    });
  };
}

export function toggleImportance (id) {
  return {
    type: 'TOGGLE_IMPORTANCE',
    payload: {
      id
    }
  };
}

export default noteReducer;
