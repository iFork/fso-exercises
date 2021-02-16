import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { vote } from '../reducers/anecdoteReducer'


function AnecdoteList () { 
  const anecdotes = useSelector(state => state)
  const dispatch = useDispatch()

  // sort by descending order
  const anecdotesSorted = [...anecdotes].sort((a, b) => b.votes - a.votes)

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
            <button onClick={() => dispatch(vote(anecdote.id))}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AnecdoteList
