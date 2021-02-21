import React, { useEffect } from 'react';
import {useDispatch} from 'react-redux';
import Notification from './components/Notification';
import AnecdoteForm from './components/AnecdoteForm';
import AnecdoteList from './components/AnecdoteList';
import Filter from './components/Filter';
import anecdoteService from './services/anecdoteService';
import {initAnecdotes} from './reducers/anecdoteReducer';


const App = () => {
  const dispatch = useDispatch();
  // initialize store state from server
  useEffect(() => {
    anecdoteService.getAll()
      .then((anecdotes) => dispatch(initAnecdotes(anecdotes)));
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
