import React, { useState } from 'react'
import { forwardRef, useImperativeHandle } from 'react'
import PropTypes from 'prop-types'

function normalizeAttribute(attribute) {
  return attribute.trim().replace(/\s+/g, '-').toLowerCase()
}

const Togglable = forwardRef( ({ buttonLabel, children }, ref) => {
  const [visible, setVisible] = useState(false)

  const showWhenIsVisible = {
    display: visible ? '' : 'none'
  }
  const hideWhenIsVisible = {
    display: visible ? 'none' : ''
  }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  useImperativeHandle(ref, () => ({ toggleVisibility }))

  return (
    <div>
      <div data-testid='togglableContent' style={showWhenIsVisible}>
        {children}
        <button
          type="button"
          onClick={toggleVisibility}
        >
                    Cancel
        </button>
      </div>
      <div style={hideWhenIsVisible}>
        <button
          // TODO: apply some normalization to buttonLabel before using
          // in attribute (lowercase, spaces to kebab-case)
          data-testid={`toggle__${normalizeAttribute(buttonLabel)}`}
          type="button"
          onClick={toggleVisibility}
        >
          {buttonLabel}
        </button>
      </div>
    </div>
  )
} )

Togglable.displayName = 'Togglable'

Togglable.propTypes = {
  buttonLabel: PropTypes.string.isRequired
}

export default Togglable
