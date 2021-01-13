describe('Bloglist app', function () {
  beforeEach(function () {
    // clear db with api for testing
    cy.request('POST', '/api/testing/reset');
    cy.visit('/');
  });
  it('Login form is shown', function () {
    cy.contains(/username/i);
    cy.contains(/password/i);
    cy.contains(/login/i);
  });
});
