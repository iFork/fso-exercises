import React, { useState } from 'react'
import { forwardRef, useImperativeHandle } from 'react'

const Togglable = forwardRef( ({ buttonLabel, children }, ref) => {
    const [visible, setVisible] = useState(false)

    const showWhenIsVisible = { 
        display: visible ? "" : "none"
    }
    const hideWhenIsVisible = { 
        display: visible ? "none" : ""
    }

    const toggleVisibility = () => {
        setVisible(!visible)
    }

    useImperativeHandle(ref, () => ({ toggleVisibility }))

    return (
        <div>
            <div style={showWhenIsVisible}>
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
                    type="button"
                    onClick={toggleVisibility}
                >
                    {buttonLabel}
                </button>
            </div>
        </div>
    )
} )

export default Togglable
