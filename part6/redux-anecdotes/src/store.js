import { createStore } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import reducer from './reducers/anecdoteReducer'

export default createStore(
  reducer,
  // typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION__ 
    // && window.__REDUX_DEVTOOLS_EXTENSION__()
  composeWithDevTools()
)
