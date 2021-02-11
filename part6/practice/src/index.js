import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import store from './store';

// Steps:
// import redux (createStore) -- in index?
// define reducer func
// define action creators along with a reducer
// create store w/ reducer callback
// in component - onClick - dispatch actions (via action creators) to the store
// subscribe render callback w/ store (completes substitution of useState hook)

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


function renderApp() { 
  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    document.getElementById('root')
  )
}

// first render
renderApp();

store.subscribe(renderApp);

