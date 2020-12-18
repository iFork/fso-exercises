
describe('Note app', function() {
  beforeEach(function () {
    cy.visit('localhost:3000')
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
})
