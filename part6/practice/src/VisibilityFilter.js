import { useDispatch } from 'react-redux'
import { setFilter } from './reducers/filterReducer'

export default function VisibilityFilter() {
  const dispatch = useDispatch()

  // Or, alternatively, hardcode radio values inside inline handler callbacks, 
  // get rid of value attribute of input instead of getting value via
  // event.target.value
  const handleFilter = (evt) => {
    console.log(evt.target.value)
    dispatch(setFilter(evt.target.value))
  }

  // TODO: reflect initial checked state ('all') in ragio group (from redux
  // slice?)
  return (
    <div>
      <label>
        <input
          type="radio"
          name="visibility-filter"
          value="all"
          onChange={handleFilter}
        />
        all 
      </label>
      <label>
        <input
          type="radio"
          name="visibility-filter"
          value="important"
          onChange={handleFilter}
        />
        important 
      </label>
      <label>
        <input
          type="radio"
          name="visibility-filter"
          value="nonimportant"
          onChange={handleFilter}
        />
        nonimportant 
      </label>
    </div>
  )
}
