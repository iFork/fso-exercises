
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
    cy.get('[data-testid=login__toggle]').click()
    // NOTE: following does not check visibility
    // Q: Is visibility check by jest-dom's toBeVisible() in unit test
    // sufficient?
    cy.contains(/username/i)
    cy.contains(/password/i)
  })
  it('user can log in', function() {
    cy.get('[data-testid=login__toggle]').click()
    cy.get('#id_username').type('roota')
    cy.get('#id_password').type('pass')
    cy.get('[data-testid=login__submit-button]').click()
    cy.contains(/logged in as roota/i)
  })
  it('login fails with wrong password', function() {
    cy.get('[data-testid=login__toggle]').click()
    cy.get('#id_username').type('roota')
    cy.get('#id_password').type('wrongpass')
    cy.get('[data-testid=login__submit-button]').click()

    // cy.contains(/username or password is invalid/i)
    // cy.get('.error').contains(/username or password is invalid/i)
    cy.contains(/username or password is invalid/i)
      .should('have.class', 'error')
      // Note: cypress works only with rgb codes, not color names
      // .and('have.css', 'color', 'red')
      .and('have.css', 'color', 'rgb(255, 0, 0)')
      .and('have.css', 'border-style', 'solid')
      // Or, alternatively:
      // NOTE: Since value for 'have.css' chaniners shoul be string,
      // can instead use a 'match' chainer to pass a regex.
      // Wrong -> .and('have.css', 'border', /solid/)
      .and('have.css', 'border') // NOTE: this changes subject and yields value
      // of the 'border'
      .and('match', /solid/)

    // Wrong -> cy.not.contains(..)
    cy.get('html')
      // NOTE: using Chai-jQuery chainer 'contain', to be able to negate w/ 'not'
      .should('not.contain', /logged in as/i)
  })
  describe('when logged in', function() {
    beforeEach(function() {
      cy.login('roota', 'pass')
    })
    it('can create new note', function() {
      const noteTitle = 'note created by cypress'
      cy.get('[data-testid=add-note__toggle]').click()
      // to clean field before typing?
      cy.get('#note_title').type(noteTitle)
      cy.contains(/add note/i).click()
      cy.contains(noteTitle)
    })
    describe('and a note exists', function() {
      const noteTitle1 = 'first note'
      const noteTitle2 = 'second note'
      const noteTitle3 = 'third note'
      beforeEach(function () {
        cy.createNote({ content: noteTitle1, important: false })
        cy.createNote({ content: noteTitle2, important: false })
        cy.createNote({ content: noteTitle3, important: false })
      })
      it('can toggle importance', function() {
        cy.contains(noteTitle2)
          .parent() //.as('noteNode')
          // .contains(/make important/i)
          // NOTE: But alias elements as soon as possible instead of further
          // down a chain of commands
          .find('button').as('theButton')
          // .should('contain', 'Make important')
          // NOTE: find() yields jQuery object therefore `match` fails, since
          // it requires string subject.
          // Invoke method of a yielded jQuery object to get text.
          // This `invoke` changes the subject, chaining expecting node, breaks
          // .invoke('text') 
          // .should('match', /make important/i)
          // NOTE: `contains` works with regex, but not 'contain' chainer (from
          // Chai).
          .contains(/make important/i)
          .click()
        // cy.get('@noteNode')
        cy.get('@theButton')
          // .should('contain', 'Make not important')
          .contains(/make not important/i)
      })
    })
  })
})
