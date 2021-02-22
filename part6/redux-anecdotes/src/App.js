import React, { useEffect } from 'react';
import {connect} from 'react-redux';
import Notification from './components/Notification';
import AnecdoteForm from './components/AnecdoteForm';
import AnecdoteList from './components/AnecdoteList';
import Filter from './components/Filter';
import {initAnecdotes} from './reducers/anecdoteReducer';


const App = ({ initAnecdotes }) => {
  // initialize store state from server
  useEffect(() => {
    initAnecdotes();
    // console.log('in effect hook');
  }, [initAnecdotes]); // dispatch mapped to prop (initAnecdotes) has stable
  // identity like dispatch from useDispatch hook. 

  return (
    <div>
      <Notification />      
      <Filter />
      <AnecdoteList />
      <AnecdoteForm />
    </div>
  );
};

const mapDispatchToProps = {
  initAnecdotes,
};
export default connect(null, mapDispatchToProps)(App);
