import React from 'react';
import ReactDOM from 'react-dom';
import store from './store';

// Steps:
// import redux (createStore) -- in index?
// define reducer func
// create store w/ reducer callback
// in component - onClick - dispatch actions to the store
// subscribe render callback w/ store (completes substitution of useState hook)

store.dispatch({
  type: 'NEW_NOTE',
  payload: {
    id: 1,
    content: 'State management now is in redux',
    importance: false
  }
})

store.dispatch({
  type: 'NEW_NOTE',
  payload: {
    id: 2,
    content: 'Actions are dispatched to store',
    importance: true
  }
})


function App() {
  // const [count, setCount] = useState(0);

  return (
    <div className="App">
      <header className="App-header">Notes</header>
      <ul>
        {store.getState().map(note => {
          return (
            <li key={note.id}>
              {note.content} {note.importance ? <strong>Important</strong> : ''}
            </li>
          )
        })}
      </ul>
    </div>
  );
}


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

