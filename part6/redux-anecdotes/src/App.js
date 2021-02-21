import React, { useEffect } from 'react';
import {useDispatch} from 'react-redux';
import Notification from './components/Notification';
import AnecdoteForm from './components/AnecdoteForm';
import AnecdoteList from './components/AnecdoteList';
import Filter from './components/Filter';
import {initAnecdotes} from './reducers/anecdoteReducer';


const App = () => {
  const dispatch = useDispatch();
  // initialize store state from server
  useEffect(() => {
    dispatch(initAnecdotes());
  }, [dispatch]);

  return (
    <div>
      <Notification />      
      <Filter />
      <AnecdoteList />
      <AnecdoteForm />
    </div>
  );
};

export default App;
