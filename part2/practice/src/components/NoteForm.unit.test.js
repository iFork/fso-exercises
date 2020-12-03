import React from 'react'
import { render, fireEvent } from '@testing-library/react'
// import { prettyDOM } from '@testing-library/dom'
import '@testing-library/jest-dom/extend-expect'
import NoteForm from './NoteForm.js'

describe('<NoteForm />', () => {
  let component
  let createNoteCb
  let togglableRef
  beforeEach(() => {
    createNoteCb = jest.fn()
    togglableRef = {
      current: {
        toggleVisibility: jest.fn()
      }
    }
    component = render(<NoteForm
      createNote={createNoteCb}
      togglableRef={togglableRef} />)
  })
  test('input is passed to callback for note creation', () => {
    // input text
    // let input = component.container.querySelector('input')
    let input = component.getByLabelText(/note/i)
    // console.log(prettyDOM(input))
    fireEvent.change(input, {
      target: {
        value: 'Testing note entry'
      }
    })
    // submit form
    let form = component.container.querySelector('form')
    // console.log(prettyDOM(form))
    fireEvent.submit(form)
    // check cb
    expect(createNoteCb).toHaveBeenCalledTimes(1)
    expect(createNoteCb.mock.calls[0][0]).toMatchObject({
      content: 'Testing note entry'
    })
  })
  test('submit calls visibility toggler', () => {
    let input = component.getByLabelText(/note/i)
    fireEvent.change(input, {
      target: {
        value: 'Testing note entry'
      }
    })
    // submit form
    let form = component.container.querySelector('form')
    fireEvent.submit(form)
    // check cb
    expect(togglableRef.current.toggleVisibility).toHaveBeenCalledTimes(1)
  })
})
