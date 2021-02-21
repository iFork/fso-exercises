import React from 'react';
import { useDispatch } from 'react-redux';
import { addAnecdote } from '../reducers/anecdoteReducer';
import {
  setNewAnecdoteNotification,
  removeNotification
} from '../reducers/notificationReducer';
import anecdoteService from '../services/anecdoteService';


function AnecdoteForm () {
  const dispatch = useDispatch();

  async function handleSubmit (evt) {
    evt.preventDefault();
    const anecdoteContent = evt.target.content.value;
    evt.target.content.value = '';
    const anecdoteCreated = await anecdoteService.create({
      content: anecdoteContent,
      vote: 0
    });
    dispatch(addAnecdote(anecdoteCreated));
    // NOTE: When async call gets in the middle of `evt.target` readings we get 
    // ERROR in react v. < 17:
    // "accessing the property `target` on a released/nullified synthetic event.
    // This is set to null. If you must keep the original synthetic event
    // around, use event.persist()."
    // FIX: either move `evt` accessing above async call or use callback ref
    // assigning the node to some useRef or update react.
    // evt.target.content.value = ''
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
