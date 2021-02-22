import React from 'react';
import { connect } from 'react-redux';
import { addAnecdote } from '../reducers/anecdoteReducer';
import { setNewAnecdoteNotification } from '../reducers/notificationReducer';


function AnecdoteForm ({ addAnecdote, setNewAnecdoteNotification }) {

  async function handleSubmit (evt) {
    evt.preventDefault();
    const anecdoteContent = evt.target.content.value;
    evt.target.content.value = '';
    addAnecdote(anecdoteContent);
    setNewAnecdoteNotification(anecdoteContent);
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

const mapDispatchToProps = {
  addAnecdote,
  setNewAnecdoteNotification,
};
export default connect(null, mapDispatchToProps)(AnecdoteForm);
