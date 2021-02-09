import deepFreeze from 'deep-freeze'
import counterReducer from './reducer'

describe('unicafe reducer', () => {
  const initialState = {
    good: 0,
    ok: 0,
    bad: 0
  }

  test('returns a proper initial state when called with undefined state', () => {
    // const state = {}
    const action = {
      type: 'DO_NOTHING'
    }

    const newState = counterReducer(undefined, action)
    expect(newState).toEqual(initialState)
  })
  test('good is incremented', () => {
    const action = {
      type: 'GOOD'
    }
    const state = initialState
    // NOTE: This superfluous. This is a reference copy.
    // Calling deepFreeze() on a reference copy is same as calling on the
    // original identifier and it may be confusing for reader.

    deepFreeze(state)
    const newState = counterReducer(state, action)
    expect(newState).toEqual({
      good: 1,
      ok: 0,
      bad: 0
    })
  })
  test('neutral (ok) is incremented', () => {
    const action = {
      type: 'OK'
    }
    deepFreeze(initialState)
    const newState = counterReducer(initialState, action)
    expect(newState).toEqual({
      good: 0,
      ok: 1,
      bad: 0
    })
  })
  test('bad is incremented', () => {
    const action = {
      type: 'BAD'
    }
    deepFreeze(initialState)
    const newState = counterReducer(initialState, action)
    expect(newState).toEqual({
      good: 0,
      ok:0,
      bad: 1
    })
  })
  test('stat is reset', () => {
    const action = {
      type: 'ZERO'
    }
    let state = {
      good: 5,
      ok: 0,
      bad: 3
    }
    deepFreeze(state)
    const newState = counterReducer(state, action)
    expect(newState).toEqual({
      good: 0,
      ok:0,
      bad: 0
    })
  })
})
