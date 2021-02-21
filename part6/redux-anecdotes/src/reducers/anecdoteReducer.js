
// TODO: Q: Research unnecessary / excessive re-rendering caused by replacing all
// state in pure reducer. Maybe store slices are for helping with that?
// e.g. see [Immutable Data | Redux](https://redux.js.org/faq/immutable-data#how-can-immutability-in-your-reducers-cause-components-to-render-unnecessarily)
//
const reducer = (state = [], action) => {
  switch (action.type) {
    case 'INIT_ANECDOTES':
      return action.payload;
    case 'VOTE':
      const idToChange = action.payload.id;
      const anecdoteToChange = state.find(anecdote => {
        return anecdote.id === idToChange;
      });
      const changedAnecdote = {
        ...anecdoteToChange,
        votes: anecdoteToChange.votes + 1
      };
      return state.map(anecdote => {
        return anecdote.id === idToChange ? changedAnecdote : anecdote;
      });
    case 'ADD_ANECDOTE':
      return state.concat(action.payload);
    default:
      return state;
  }
};

// action creators
// TODO: import action types as (predefined) constants (from actionTypes.js)
// for easy reuse
export function initAnecdotes(anecdotes) {
  return {
    type: 'INIT_ANECDOTES',
    payload: anecdotes
  };
}
export function vote(id) {
  return {
    type: 'VOTE',
    payload: { id }
  };
}

export function addAnecdote(anecdote) {
  return {
    type: 'ADD_ANECDOTE',
    payload: anecdote
  };
}

export default reducer;
