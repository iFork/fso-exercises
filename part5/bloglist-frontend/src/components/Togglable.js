import React, { useState } from 'react'
import { useImperativeHandle, forwardRef } from 'react'
import PropTypes from 'prop-types'

const Togglable = forwardRef(({ buttonLabel, children }, ref) => {
  const [visible, setVisible] = useState(false)

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  useImperativeHandle(ref, () => ({ toggleVisibility }))
  // inline css for jsx
  const showWhenIsVisible = { display: visible ? '' : 'none' }
  const showWhenNotVisible = { display: visible ? 'none' : '' }
  return (
    <div>
      <div style={showWhenIsVisible}>
        {children}
        <button
          type="button"
          onClick={ () => toggleVisibility() }
        >
          Cancel
        </button>
      </div>
      <div style={showWhenNotVisible}>
        <button
          type="button"
          onClick={ () => toggleVisibility() }
        >
          {buttonLabel}
        </button>
      </div>
    </div>
  )
})

Togglable.displayName = 'Togglable'

Togglable.propTypes = {
  buttonLabel: PropTypes.string.isRequired
}

export default Togglable
