
describe('Note app', function() {
  beforeEach(function () {
    const baseUrl = 'localhost:3000'
    cy.request('POST', `${baseUrl}/api/testing/reset`)
    const user = {
      username: 'roota',
      name: 'Root TestUser',
      password: 'pass'
    }
    // NOTE: `await`ing cy.request and assigning its return value breaks further
    // cy.<command> calls.
    // const resp = await cy.request('POST', `${baseUrl}/api/users`, user)
    cy.request('POST', `${baseUrl}/api/users`, user)
    cy.visit(baseUrl)
  })
  it('front page can be opened', function() {
    cy.contains('Notes')
    // cy.contains(/login/i).click() // first is not toggler but submitter
  })
  it('login form can be opened', function() {
    cy.get('[data-testid=toggle__login]').click()
    // NOTE: following does not check visibility
    // Q: Is visibility check by jest-dom's toBeVisible() in unit test
    // sufficient?
    cy.contains(/username/i)
    cy.contains(/password/i)
  })
  it('user can log in', function() {
    cy.get('[data-testid=toggle__login]').click()
    cy.get('#id_username').type('roota')
    cy.get('#id_password').type('pass')
    cy.get('[data-testid=login-form__submit-button]').click()
    cy.contains(/logged in as roota/i)
  })
  describe('when logged in', function() {
    beforeEach(function() {
      cy.get('[data-testid=toggle__login]').click()
      cy.get('#id_username').type('roota')
      cy.get('#id_password').type('pass')
      cy.get('[data-testid=login-form__submit-button]').click()
    })
    it('can create new note', function() {
      const noteTitle = 'note created by cypress'
      cy.get('[data-testid=toggle__add-note]').click()
      // to clean field before typing?
      cy.get('#note_title').type(noteTitle)
      cy.contains(/add note/i).click()
      cy.contains(noteTitle)
    })
    describe('and a note exists', function() {
      const noteTitle = 'another note created by cypress'
      beforeEach(function () {
        // Create dummy notes : from frontend as api requires auth header
        // which is handed in response to login.
        cy.get('[data-testid=toggle__add-note]').click()
        // to clean field before typing?
        cy.get('#note_title').type(noteTitle)
        cy.contains(/add note/i).click()
      })
      it('can toggle importance', function() {
        cy.contains(noteTitle)
          .contains(/make important/i)
          .click()
        cy.contains(noteTitle)
          .contains(/make not important/i)
      })
    })
  })
})
