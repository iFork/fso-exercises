describe('Bloglist app', function () {
  const userA = {
    username: 'userA',
    name: 'Amy',
    password: 'passA',
    blogs: [
      {
        title: 'Test Title',
        author: 'Test Author',
        url: 'http://test.url',
      },
    ],
  };
  const userB = {
    username: 'userB',
    name: 'Bob',
    password: 'passB',
  };
  beforeEach(function () {
    // clear db with api for testing
    cy.request('POST', '/api/testing/reset');
    // seed db with users
    cy.request('POST', '/api/users', userA);
    cy.request('POST', '/api/users', userB);
    cy.visit('/');
  });
  describe('Login', function () {
    it('Succeeds with correct credentials', function () {
      // cy.contains(/username/i).parent().within(() => {
      //   cy.get('input').type('root');
      // });
      cy.get('#id_username').type(userA.username);
      cy.get('#id_password').type(userA.password);
      cy.contains(/login/i).click();

      cy.contains(/logged in as/i)
        .should('have.class', 'successNotification');
    });
    it('Fails with wrong credentials with error message', function () {
      cy.get('#id_username').type(userA.username);
      cy.get('#id_password').type(`wrong${userA.password}`);
      cy.contains(/login/i).click();

      cy.contains(/invalid/i)
        .should('have.class', 'errorNotification')
        .and(
          'have.css',
          'border-color',
          'rgb(255, 0, 0)',
        );

      cy.get('html').should('not.contain', /logged in as/i);
    });
  });
  describe('When logged in as userA', function () {
    beforeEach(function () {
      // login with api, not UI
      const { username, password } = userA;
      cy.request('POST', '/api/login', { username, password })
        .then((resp) => {
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
    describe('And userA already has blogs', function () {
      beforeEach(function () {
        // TODO: move blog creator into a cypress/support/commands
        const { token } = JSON.parse(localStorage.getItem('loggedBlogappUser'));
        cy.request({
          method: 'POST',
          url: '/api/blogs',
          headers: {
            authorization: `Bearer ${token}`,
          },
          body: userA.blogs[0],
        });
        // reload page to get updated blog list
        cy.visit('/');
      });
      it('userA can like her blog', function () {
        cy.get('.blog.compactView')
          // .contains(/view/i).click();
          .contains(userA.blogs[0].title).within(() => {
            // expand blog
            // TODO: existing data-testid values do not follow BEM naming
            // convention, modifying it in component code will break also jest unit tests.
            cy.get('[data-testid=viewExpander]').click();
          });
        cy.get('.blog.detailedView')
          .contains(userA.blogs[0].title).within(() => {
            cy.contains(/likes/i).contains('0');
            // from buttons get one that contains 'like'
            cy.get('button').contains(/like/i).click();
            cy.contains(/likes/i).contains('1');
          });
      });
    });
  });
});
