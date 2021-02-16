
const initialNotification = 'Welcome!'

export default function notificationReducer (
  state = initialNotification,
  action
) {
  switch (action.type) {
    case 'SET_NOTIFICATION':
      return action.payload
    default:
      return state
  }
}
