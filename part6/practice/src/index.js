import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import App from './App';
import noteReducer from './reducers/noteReducer';


// Steps:
// import redux (createStore) -- in index?
// define reducer func
// define action creators along with a reducer
// create store w/ reducer callback
// wrap root component by <Provider> of react-redux and pass store as its prop.
// in component:
// useSelector() hook of react-redux to get slices of state and subscribe
// component with store.
// useDispatch() hook of redux to dispatch actions (via action creators)

// create store with a reducer callback
const store = createStore(
  noteReducer,
  // connect to Redux Dev Tools (extension of Chrome)
  // window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION__ 
    && window.__REDUX_DEVTOOLS_EXTENSION__()
);

store.dispatch({
  type: 'NEW_NOTE',
  payload: {
    id: 1,
    content: 'State management now is in redux',
    importance: false
  }
})
//
// store.dispatch({
//   type: 'NEW_NOTE',
//   payload: {
//     id: 2,
//     content: 'Actions are dispatched to store',
//     importance: true
//   }
// })


// NOTE: wrapping render in renderApp() to pass a callback to store.subscribe() 
// pattern is needed no more, since useSelector() hooks of react-redux ensure
// subscription of compoenents with store.
ReactDOM.render(
  <Provider store={store}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Provider>,
  document.getElementById('root')
)

