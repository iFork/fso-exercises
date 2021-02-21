import anecdoteService from '../services/anecdoteService';

// TODO: Q: Research unnecessary / excessive re-rendering caused by replacing all
// state in pure reducer. Maybe store slices are for helping with that?
// e.g. see [Immutable Data | Redux](https://redux.js.org/faq/immutable-data#how-can-immutability-in-your-reducers-cause-components-to-render-unnecessarily)
//
const reducer = (state = [], action) => {
  switch (action.type) {
    case 'INIT_ANECDOTES':
      return action.payload;
    // case 'VOTE':
    //   const idToChange = action.payload.id;
    //   const anecdoteToChange = state.find(anecdote => {
    //     return anecdote.id === idToChange;
    //   });
    //   console.log({ anecdoteToChange });
    //   const changedAnecdote = {
    //     ...anecdoteToChange,
    //     votes: anecdoteToChange.votes + 1
    //   };
    //   return state.map(anecdote => {
    //     return anecdote.id === idToChange ? changedAnecdote : anecdote;
    //   });
    case 'ADD_ANECDOTE':
      return state.concat(action.payload);
    case 'UPDATE':
      return state.map(anecdote => {
        return anecdote.id === action.payload.id ? action.payload : anecdote;
      });
    default:
      return state;
  }
};

// action creators
// TODO: import action types as (predefined) constants (from actionTypes.js)
// for easy reuse
export function initAnecdotes() {
  return async function (dispatch) { 
    const anecdotes = await anecdoteService.getAll();
    dispatch({
      type: 'INIT_ANECDOTES',
      payload: anecdotes
    });
  };
}
export function vote(anecdote) {
  return async function (dispatch) {
    const votedAnecdote = {
      ...anecdote,
      votes: anecdote.votes + 1
    };
    const changedAnecdote = await anecdoteService.update(votedAnecdote);
    // Q: vote dispatch by id ? or just updated payload (whole body) from server?
    dispatch({
      type: 'UPDATE',
      payload: changedAnecdote
    });
  };
}

export function addAnecdote(anecdoteContent) {
  return async function (dispatch) { 
    const anecdoteCreated = await anecdoteService.create({
      content: anecdoteContent,
      // BUG FIX: typo in field name ('vote' in place of 'votes'), voting got
      // 'NaN' bug.
      votes: 0
    });
    dispatch({
      type: 'ADD_ANECDOTE',
      payload: anecdoteCreated
    });
  };
}

export default reducer;
