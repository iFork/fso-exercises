/* eslint-disable react/jsx-filename-extension */
/* eslint-disable react/prop-types */
import React, { useState, useImperativeHandle, forwardRef } from 'react';

import PropTypes from 'prop-types';

/**
 * Normalize string to be suitable for use as attribute value in HTML.
 * Replace space with dashes, make lowercase.
 *
 * @param {String} attributeName - string to be normalized.
 * @return {String} normalized string.
 */
function normalizeAttributeName(attributeName) {
  // regex replace, lower case
  return attributeName.trim().replace(/\s+/, '-').toLowerCase();
}
const Togglable = forwardRef(({ buttonLabel, children }, ref) => {
  const [visible, setVisible] = useState(false);

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  useImperativeHandle(ref, () => ({ toggleVisibility }));
  // inline css for jsx
  const showWhenIsVisible = { display: visible ? '' : 'none' };
  const showWhenNotVisible = { display: visible ? 'none' : '' };
  return (
    <div>
      <div style={showWhenIsVisible}>
        {children}
        <button
          type="button"
          onClick={() => toggleVisibility()}
        >
          Cancel
        </button>
      </div>
      <div style={showWhenNotVisible}>
        <button
          data-testid={`${normalizeAttributeName(buttonLabel)}__toggle`}
          type="button"
          onClick={() => toggleVisibility()}
        >
          {buttonLabel}
        </button>
      </div>
    </div>
  );
});

Togglable.displayName = 'Togglable';

Togglable.propTypes = {
  buttonLabel: PropTypes.string.isRequired,
};

export default Togglable;
