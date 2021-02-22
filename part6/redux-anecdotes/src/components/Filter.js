import React from 'react';
import { connect } from 'react-redux';
import { setFilter } from '../reducers/filterReducer';

function Filter ({ setFilter }) {
  const handleFilter = (evt) => {
    console.log(evt.target.value);
    setFilter(evt.target.value);
  };

  const style = {
    marginBottom: 10,
    marginTop: 10
  };

  return (
    <div style={style}>
      <div>Filter anecdotes</div> 
      <input
        onChange={handleFilter}
      />
    </div>
  );
}

const mapDispatchToProps = {
  setFilter,
};
export default connect(null, mapDispatchToProps)(Filter);
