const anecdotesAtStart = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]

const getId = () => Number((100000 * Math.random()).toFixed(0))

const asObject = (anecdote) => {
  return {
    content: anecdote,
    id: getId(),
    votes: 0
  }
}

const initialState = anecdotesAtStart.map(asObject)

// TODO: Q: Research unnecessary / excessive re-rendering caused by replacing all
// state in pure reducer. Maybe store slices are for helping with that?
// e.g. see [Immutable Data | Redux](https://redux.js.org/faq/immutable-data#how-can-immutability-in-your-reducers-cause-components-to-render-unnecessarily)
//
const reducer = (state = initialState, action) => {
  console.log('state now: ', state)
  console.log('action', action)
  switch (action.type) {
    case 'VOTE':
      const idToChange = action.payload.id
      const anecdoteToChange = state.find(anecdote => {
        return anecdote.id === idToChange;
      });
      const changedAnecdote = {
        ...anecdoteToChange,
        votes: anecdoteToChange.votes + 1
      }
      return state.map(anecdote => {
        return anecdote.id === idToChange ? changedAnecdote : anecdote;
      });
    case 'ADD_ANECDOTE':
      return state.concat(action.payload)
    default:
      return state
  }
}

// action creators
// TODO: import action types as (predefined) constants (from actionTypes.js)
// for easy reuse
export function vote(id) {
  return {
    type: 'VOTE',
    payload: { id }
  }
}

export function addAnecdote(content) {
  return {
    type: 'ADD_ANECDOTE',
    payload: {
      content,
      id: getId(),
      votes: 0
    }
  }
}

export default reducer
