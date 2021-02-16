
export default function filterReducer (state = 'all', action) {
  switch (action.type) {
    case 'SET_FILTER':
      return action.payload
    default:
      return state
  }
}

/**
 * setFilter action creator
 *
 * @param {('all'|'important'|'nonimportant')} filterSelected - one of selected
 * values
 * @return {{type: ('SET_FILTER'), payload: string}} action of type SET_FILTER
 */
export function setFilter(filterSelected) {
  return {
    type: 'SET_FILTER',
    payload: filterSelected
  }
}
