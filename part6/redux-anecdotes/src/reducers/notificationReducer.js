
const initialNotification = 'Welcome!';

// NOTE: Discuss: Alternative way is listening for 'VOTE' and 'ADD_ANECDOTE'
// actions (their action creator is in anecdotesReducer) also here and setting
// notification here accordingly. But for that we need to ammend 'VOTE's 
// payload to include also anecdote content (not only its id).
// Or, shoud we look up anecdote content by id in this reducer? 
// Q: In that case how to access other slices of state (namespaced by combineReducers)?
export default function notificationReducer (
  state = initialNotification,
  action
) {
  switch (action.type) {
    case 'SET_NOTIFICATION':
      return action.payload;
    case 'REMOVE_NOTIFICATION':
      return '';
    default:
      return state;
  }
}


export function setVoteNotification (anecdoteContent) {
  return {
    type: 'SET_NOTIFICATION',
    payload: `you have voted for '${anecdoteContent}'`
  };
}
export function setNewAnecdoteNotification (anecdoteContent) {
  return {
    type: 'SET_NOTIFICATION',
    payload: `you have added '${anecdoteContent}'`
  };
}
export function removeNotification () {
  return {
    type: 'REMOVE_NOTIFICATION'
  };
}
