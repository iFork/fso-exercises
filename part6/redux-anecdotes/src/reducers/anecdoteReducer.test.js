import deepFreeze from 'deep-freeze'
import reducer, { vote } from './anecdoteReducer'

describe('anecdoteReducer', () => {
  test('VOTE action increments vote immutably', () => {
    const state = [{
        content: 'some fun anecdote',
        id: 1,
        votes: 0
      }]
    const action = {
      type: 'VOTE',
      payload: { id: 1 }
    }
    deepFreeze(state);
    const newState = reducer(state, action)
    expect(newState).toHaveLength(1);
    expect(newState).toContainEqual({
        content: 'some fun anecdote',
        id: 1,
        votes: 1
    })
  })
  test('vote action creator works like VOTE action', () => {
    const state = [{
        content: 'some fun anecdote',
        id: 1,
        votes: 0
      }]
    const action = vote(1)
    deepFreeze(state);
    const newState = reducer(state, action)
    expect(newState).toHaveLength(1);
    expect(newState).toContainEqual({
        content: 'some fun anecdote',
        id: 1,
        votes: 1
    })
  })
})

