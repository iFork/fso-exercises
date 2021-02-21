import React from 'react';
import { useDispatch } from 'react-redux';
import { addAnecdote } from '../reducers/anecdoteReducer';
import {
  setNewAnecdoteNotification,
  removeNotification
} from '../reducers/notificationReducer';


function AnecdoteForm () {
  const dispatch = useDispatch();

  async function handleSubmit (evt) {
    evt.preventDefault();
    const anecdoteContent = evt.target.content.value;
    evt.target.content.value = '';
    dispatch(addAnecdote(anecdoteContent));
    dispatch(setNewAnecdoteNotification(anecdoteContent));
    setTimeout(() => dispatch(removeNotification()), 5000);
  }

  return ( 
    <div>
      <h2>create new</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <input name="content"/>
        </div>
        <button>create</button>
      </form>
    </div>
  );
}

export default AnecdoteForm;
