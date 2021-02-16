import deepFreeze from 'deep-freeze';
import noteReducer from './noteReducer';
// import store from './store'

describe('Note app', () => {
  // NOTE: test reducer functions in isolation, on their own, not as part of
  // the redux store. Rationales include:
  // - asserting that reducer is pure function / does immutable updates 
  // is not straightforward when we access state w/ store.getState(). 
  // Using deep-freeze utility on (state returned by accessor) is futile. 
  // We should use deep-freeze utility on our own state objects.
  describe('noteReducer', () => { 
    test('returns new state with action NEW_NOTE', () => {
      // Meaningless --> let oldState = deepFreeze(store.getState());
      const action = {
        type: 'NEW_NOTE',
        payload: {
          id: 1,
          content: 'State management now is in redux',
          important: false
        }
      };
      // store.dispatch(action)
      // let newState = store.getState();
      let state = [];
      deepFreeze(state);
      let newState = noteReducer(state, action);
      // expect(state).toEqual([]); <-- this tests deep-freez utility, not our code
      expect(newState).toContainEqual(action.payload);
      expect(newState).toHaveLength(1);
    })
    test('Toggling important of note w/ action TOGGLE_IMPORTANCE', () => {
      let state = [ 
        {
          id: 1,
          content: 'State management now is in redux',
          important: false
        },
        {
          id: 2,
          content: 'Actions are dispatched to store',
          important: true
        }
      ];
      let action = {
        type: 'TOGGLE_IMPORTANCE',
        payload: {
          id: 1
        }
      }
      let oldState = [ ...state ]; // this makes sense only when we want to
      // test also deep-freez utility
      // Otherwise, do just `deepFreeze(state)`, `oldState` is superfluous
      deepFreeze(oldState);
      let newState = noteReducer(oldState, action)
      // assert non-changed note and changed note
      let originalNote = state[0];
      let changedNote = newState[0];
      let untouchedNoteBefore = state[1]
      expect(oldState).toEqual(state);
      expect(changedNote)
        .toEqual({
          // ...originalNote,
          // important: !originalNote.important
          id: 1,
          content: 'State management now is in redux',
          important: true
        })
      // or, equivalently
      expect(newState)
        .toContainEqual({
          ...originalNote,
          important: !originalNote.important
          // id: 1,
          // content: 'State management now is in redux',
          // important: true
        })
      expect(newState)
        .toContainEqual(untouchedNoteBefore);
    })
  })
})
