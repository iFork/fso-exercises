import React from 'react';
import { render, fireEvent } from '@testing-library/react'
import { prettyDOM } from '@testing-library/dom'
import '@testing-library/jest-dom/extend-expect'
import Togglable from './Togglable'

describe('<Togglable />', () => {
  let component
  const buttonLabelShow = 'show...'
  const buttonLabelClose = 'Cancel'
  const testIdOfTogglableContent = 'togglableContent'

  beforeEach(() => {
    component = render(
      <Togglable buttonLabel={buttonLabelShow}>
        <div data-testid='test' className='testDiv'>
          Test Div
        </div>
      </Togglable>
    )
  })

  test('childer are rendered', () => {
    let togglableDiv = component.getByTestId(testIdOfTogglableContent)
    expect(togglableDiv).toBeInTheDocument()
  })
  test('childer are hidden initially', () => {
    let togglableDiv = component.getByTestId(testIdOfTogglableContent)
    expect(togglableDiv).toHaveStyle('display: none')
  })
  test('childer are shown and hidden on clicks on toggler button', () => {
    // component.debug();
    let showButton = component.getByText(buttonLabelShow)
    fireEvent.click(showButton)
    let togglableDiv = component.getByTestId(testIdOfTogglableContent)
    expect(togglableDiv).not.toHaveStyle('display: none')
    let closeButton = component.getByText(buttonLabelClose)
    fireEvent.click(closeButton)
    expect(togglableDiv).toHaveStyle('display: none')
    // or
    // NOTE: With :nth-child(n), *all children are counted, regardless* of what
    // they are, and the specified element is selected only if it matches the
    // selector attached to the pseudo-class.
    // In this case, close button has 1 sibling before it (div to be hidden),
    // so it is 2nd child inside its parent, (while 'show' button has no siblings
    // before it).
    // let closeButton = component.container.querySelector('button:nth-child(2)')
  })
  // test('content is hidden after click on cancel button', () => {
  //   let closeButton = component.getByText(buttonLabelClose)
  //   fireEvent.click(closeButton)
  //   // NOTE: at start close button is inside hidden block,
  //   // *clicking on hidden button* works and togller callback is triggered
  //   // however, in effect, reversing toggler behavior
  //   // (i.e. clicking on closeButton causes 'open' behavior).
  // })
})
