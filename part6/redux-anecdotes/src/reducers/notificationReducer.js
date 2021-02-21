
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

// TODO: removing is buggy. When it is called it clears everything
// irrespective when it was added.
// Better implement notifications with id-s and remove by id?
function popNotification (text, duration) {
  return async function (dispatch) {
    dispatch({
      type: 'SET_NOTIFICATION',
      payload: text
    });
    setTimeout(() => dispatch({
      type: 'REMOVE_NOTIFICATION'
    }), duration);
  };
}

export function setVoteNotification (anecdoteContent) {
  const text = `you have voted for '${anecdoteContent}'`;
  return popNotification(text, 5000);
}
export function setNewAnecdoteNotification (anecdoteContent) {
  const text = `you have added '${anecdoteContent}'`;
  return popNotification(text, 5000);
}
// export function removeNotification () {
//   return {
//     type: 'REMOVE_NOTIFICATION'
//   };
// }
