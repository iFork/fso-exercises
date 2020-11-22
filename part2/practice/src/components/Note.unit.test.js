import React from 'react'
import { render, fireEvent } from '@testing-library/react'
// import { prettyDOM } from '@testing-library/dom'
import '@testing-library/jest-dom/extend-expect'
import Note from './Note.js'

describe('<Note />', () => {
  test('note is rendered', () => {
    // render a component
    let note = {
      content: 'Hello testing library',
      important: false,
    }
    let component = render(<Note note={note} />)
    // verify content
    expect(component.getByText(/hello testing lib/i)).toBeInTheDocument()
    // or
    expect(component.container).toHaveTextContent('library')
    // component.debug()
    // or
    let el = component.container.querySelector('li')
    expect(el).toHaveTextContent('library')
    // console.log(prettyDOM(el))
  })

  test('clicking importance toggler calls handler once', () => {
    // render a component
    let note = {
      content: 'Hello testing library',
      important: false,
    }
    let mockHandler = jest.fn()
    let component = render(<Note note={note} toggleImportance={mockHandler} />)
    // verify
    // expect(component.getByText(/make important/i)).toBeInTheDocument()
    let button = component.getByText(/make important/i)
    fireEvent.click(button)
    expect(mockHandler.mock.calls).toHaveLength(1)
    // or
    expect(mockHandler).toHaveBeenCalledTimes(1)
  })
})
