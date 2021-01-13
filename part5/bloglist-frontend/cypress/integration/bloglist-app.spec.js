describe('Bloglist app', function () {
  beforeEach(function () {
    // clear db with api for testing
    cy.request('POST', '/api/testing/reset');
    // seed db with users
    //
    cy.request('POST', '/api/users', {
      username: 'root',
      name: 'Root',
      password: 'pass',
    });
    cy.visit('/');
  });
  it('Login form is shown', function () {
    cy.contains(/username/i);
    cy.contains(/password/i);
    cy.contains(/login/i);
  });
  describe('Login', function () {
    it('Succeeds with correct credentials', function () {
      // cy.contains(/username/i).parent().within(() => {
      //   cy.get('input').type('root');
      // });
      cy.get('#id_username').type('root');
      cy.get('#id_password').type('pass');
      cy.contains(/login/i).click();

      cy.contains(/logged in as/i)
        .should('have.class', 'successNotification');
    });
    it('Fails with wrong credentials with error message', function () {
      cy.get('#id_username').type('root');
      cy.get('#id_password').type('wrongpass');
      cy.contains(/login/i).click();

      cy.contains(/invalid/i)
        .should('have.class', 'errorNotification')
        .and(
          'have.css',
          'border-color',
          'rgb(255, 0, 0)',
        );
    });
  });
  describe('When logged in', function () {
    beforeEach(function () {
      // login with api, not UI
      cy.request('POST', '/api/login', {
        username: 'root',
        password: 'pass',
      }).then((resp) => {
        // set localStorage since it was front-end's responsibility to set it
        localStorage.setItem(
          'loggedBlogappUser',
          JSON.stringify(resp.body),
        );
        // reload page for effect hook to process token.
        cy.visit('/');
      });
    });
    it('A blog can be created', function () {
      // cy.contains(/add blog/i).click();
      cy.get('[data-testid=add-blog__toggle]').click();
      // cy.contains(/title/i).parent().within(() => {
      //   cy.get('input').type('x');
      // });
      cy.get('#id_title').type('Test Title');
      cy.get('#id_author').type('Test Author');
      cy.get('#id_url').type('http://test.url');
      cy.contains(/add post/i).click();

      cy.get('.blog.compactView')
        .contains('Test Title').contains('Test Author').contains(/view/i);
    });
  });
});