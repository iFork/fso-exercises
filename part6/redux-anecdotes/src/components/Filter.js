import React from 'react'
import { useDispatch } from 'react-redux'
import { setFilter } from '../reducers/filterReducer';

export default function Filter () {
  const dispatch = useDispatch()

  const handleFilter = (evt) => {
    console.log(evt.target.value);
    dispatch(setFilter(evt.target.value))
  }

  const style = {
    marginBottom: 10,
    marginTop: 10
  }

  return (
    <div style={style}>
      <div>Filter anecdotes</div> 
      <input
        onChange={handleFilter}
      />
    </div>
  )
}
