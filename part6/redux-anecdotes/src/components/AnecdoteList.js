import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { vote } from '../reducers/anecdoteReducer';
import { setVoteNotification } from '../reducers/notificationReducer';


function AnecdoteList () { 
  const anecdotes = useSelector(({ anecdotes, filter }) => {
    if (filter === '')
      return anecdotes;
    return anecdotes.filter(a => a.content.toLowerCase().includes(filter));
  });
  const dispatch = useDispatch();
  
  const handleVote = (anecdote) => {
    dispatch(vote(anecdote));
    dispatch(setVoteNotification(anecdote.content));
  };  

  // sort by descending order
  const anecdotesSorted = [...anecdotes].sort((a, b) => b.votes - a.votes);

  return ( 
    <div>
      <h2>Anecdotes</h2>
      {anecdotesSorted.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AnecdoteList;
