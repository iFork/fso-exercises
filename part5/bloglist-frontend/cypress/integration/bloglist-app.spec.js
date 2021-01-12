describe('Bloglist app', function () {
  beforeEach(function () {
    cy.visit('/');
  });
  it('Opens page', function () {
    cy.contains(/log in to application/i);
  });
});
